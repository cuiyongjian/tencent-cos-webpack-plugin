[![npm version](https://img.shields.io/npm/v/tencent-cos-webpack-plugin/latest.svg?style=flat-square)](https://www.npmjs.com/package/tencent-cos-webpack-plugin) [![downloads](https://img.shields.io/npm/dw/tencent-cos-webpack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/tencent-cos-webpack-plugin) [![Build Status](https://img.shields.io/travis/cuiyongjian/tencent-cos-webpack-plugin.svg?style=flat-square)](https://travis-ci.com/cuiyongjian/tencent-cos-webpack-plugin) [![License](https://img.shields.io/npm/l/tencent-cos-webpack-plugin.svg?style=flat-square)](./License)

# Tecent COS Webpack Plugin

Upload the webpack build assets to Tencent COS, make it convinent to use CDN.

## Quick Start

```js
// import TencentCosWebpackPlugin
const TencentCosWebpackPlugin = require('tenent-cos-webpack-plugin');

// Instantiate the Plugin with your COS auth info
const cosPlugin = new CosPlugin({
  secretId: 'my-secret-id', // usual use BucketName-APPID. refer: https://cloud.tencent.com/document/product/436/36119#.E7.AE.80.E5.8D.95.E4.B8.8A.E4.BC.A0.E5.AF.B9.E8.B1.A1
  secretKey: 'my-secret-key',
  bucket: 'my-125000000',
  region: 'ap-chengdu',
  path: '[hash]/' // COS dir
  changeFileName: Function, // change the filename under COS path。
});

// Webpack config
module.exports = {
 output: {
    // your cos domain
    publicPath: "http://www.abc.com"
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

* lint & test

write unit test and execute it

```bash
npm run lint
npm run test
```

* put a pull request

## Thanks

thanks to the repostory [cos-webpack](https://github.com/takashiki/cos-webpack). I just change the output filename logic.
