# Tecent COS Webpack Plugin

Upload the webpack build assets to Tencent COS, make it convinent to use CDN.

## Quick Start

```js
// 引入
const TencentCosWebpackPlugin = require('tenent-cos-webpack-plugin');

// 配置 Plugin
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

* put a pull request

## Thanks

thanks to the repostory [cos-webpack](https://github.com/takashiki/cos-webpack). I just change the output filename logic.
