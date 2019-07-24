'use strict'

const fs = require('fs')
const COS = require('cos-nodejs-sdk-v5')
const path = require('path')
const ora = require('ora')
const isRegExp = require('lodash.isregexp')

// Constants
const REGEXP_HASH = /\[hash(?::(\d+))?\]/gi

// Uploading progress tip
const tip = (uploaded, total) => {
  const percentage = total === 0 ? 0 : Math.round((uploaded / total) * 100)
  return `Uploading to Tencent COS: ${percentage === 0 ? '' : percentage + '% '}${uploaded}/${total} files uploaded`
}

// Replace path variable by hash with length
const withHashLength = replacer => {
  return function (_, hashLength) {
    const length = hashLength && parseInt(hashLength, 10)
    const hash = replacer.apply(this, arguments)
    return length ? hash.slice(0, length) : hash
  }
}

// Perform hash replacement
const getReplacer = (value, allowEmpty) => {
  return function (match) {
    // last argument in replacer is the entire input string
    const input = arguments[arguments.length - 1]
    if (value === null || value === undefined) {
      if (!allowEmpty) throw new Error(`Path variable ${match} not implemented in this context of qn-webpack plugin: ${input}`)
      return ''
    } else {
      return `${value}`
    }
  }
}

module.exports = class TencentCosWebpackPlugin {
  constructor (options) {
    this.options = Object.assign({}, options)
    process.env.http_proxy = this.options.proxy || process.env.HTTP_RPOXY
    process.env.https_proxy = this.options.proxy || process.env.HTTPS_PROXY
  }

  apply (compiler) {
    compiler.hooks.afterEmit.tapAsync('TencentCosWebpackPlugin', (compilation, callback) => {
      // const basePath = path.basename(compiler.outputPath)
      const { changeFileName } = this.options
      const outputConfig = compiler.options.output

      const assets = compilation.assets
      const hash = compilation.hash
      let uploadPath = this.options.path || '[hash]'
      const exclude = isRegExp(this.options.exclude) && this.options.exclude
      const include = isRegExp(this.options.include) && this.options.include
      const batch = this.options.batch || 20
      const cos = new COS({
        SecretId: this.options.secretId,
        SecretKey: this.options.secretKey,
        FileParallelLimit: batch,
        ChunkParallelLimit: batch
      })
      const bucket = this.options.bucket // Bucket 的名称，命名格式为 BucketName-APPID，此处填写的存储桶名称必须为此格式
      const region = this.options.region
      uploadPath = uploadPath.replace(REGEXP_HASH, withHashLength(getReplacer(hash)))

      let filesNames = Object.keys(assets)
      let totalFiles = 0
      let uploadedFiles = 0

      // Mark finished
      const _finish = err => {
        spinner.succeed()
        // eslint-disable-next-line no-console
        console.log('\n')
        callback(err)
      }

      // Filter files that should be uploaded
      filesNames = filesNames.filter(fileName => {
        const file = assets[fileName] || {}

        // Ignore unemitted files
        if (!file.emitted) return false

        // Check excluced files
        if (exclude && exclude.test(file.existsAt)) return false

        // Check included files
        if (include) return include.test(file.existsAt)

        return true
      })

      totalFiles = filesNames.length

      // eslint-disable-next-line no-console
      console.log('\n')
      const spinner = ora({
        text: tip(0, totalFiles),
        color: 'green'
      }).start()

      // Perform upload to cos
      const performUpload = function (fileName) {
        const file = assets[fileName] || {}
        fileName = fileName.replace(/\\/g, '/') // posix 路径转换
        // 默认COS上的 filename 是 this.options.path + webpackConfig.output.filename
        // 如果有需求，可以在 this.options.changeFileName函数中更改文件名
        if (changeFileName && typeof changeFileName === 'function') {
          fileName = this.options.changeFileName(outputConfig) // 把compiler.options.output传给用户自己处理
        }
        const key = path.posix.join(uploadPath, fileName)

        return new Promise((resolve, reject) => {
          const begin = Date.now()
          cos.putObject(
            {
              Bucket: bucket,
              Region: region,
              Key: key,
              Body: fs.createReadStream(file.existsAt),
              ContentLength: fs.statSync(file.existsAt).size
            },
            function (err, body) {
              uploadedFiles++
              spinner.text = tip(uploadedFiles, totalFiles)

              if (err) return reject(err)
              body.duration = Date.now() - begin
              resolve(body)
            }
          )
        })
      }

      // Execute stack according to `batch` option
      const execStack = function (err) {
        if (err) {
          // eslint-disable-next-line no-console
          console.log('\n')
          return Promise.reject(err)
        }

        // Get 20 files
        const _files = filesNames.splice(0, batch)

        if (_files.length) {
          return Promise.all(_files.map(performUpload)).then(() => execStack(), execStack)
        } else {
          return Promise.resolve()
        }
      }

      execStack().then(() => _finish(), _finish)
    })
  }
}
