// import TencentCosWebpackPlugin from '../index'
// import { expect } from 'chai'
const { expect } = require('chai')
const TencentCosWebpackPlugin = require('../index')

describe('TencentCosWebpackPlugin 类型的测试', function () {
  const plugin = new TencentCosWebpackPlugin()
  it('new TencentCosWebpackPlugin() is a object', function () {
    expect(plugin).to.be.an.instanceof(Object)
  })
  it('new TencentCosWebpackPlugin() is a instance of TencentCosWebpackPlugin', function () {
    expect(plugin).to.be.an.instanceof(TencentCosWebpackPlugin)
  })
})
