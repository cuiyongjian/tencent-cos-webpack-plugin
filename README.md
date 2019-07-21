# Tecent COS Webpack Plugin

## Quick Start

```js
// 引入
const CosPlugin = require('cos-webpack');

// 配置 Plugin
const cosPlugin = new CosPlugin({
  secretId: 'my-secret-id',
  secretKey: 'my-secret-key',
  bucket: 'my-125000000',
  region: 'ap-chengdu',
  path: '[hash]/'
});

// Webpack 的配置
module.exports = {
 output: {
    // 此处为 COS 访问域名(bucket-1250000000.file.myqcloud.com) 加上 path([hash]/)
    publicPath: "http://bucket-1250000000.file.myqcloud.com/[hash]/"
    // ...
 },
 plugins: [
   cosPlugin
   // ...
 ]
 // ...
}
```

## Contribute

* fork the repo

* clone your repo

```bash
git clone https://github.com/xxxx/tencent-cos-webpack-plugin # clone the repo
```

* install dep

```bash
npm install # install dep
```

* coding

* put a pull request

## Thanks

thanks to the repostory [cos-webpack](https://github.com/takashiki/cos-webpack). I just change the output filename logic.
