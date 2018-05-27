# template 模版项目

> A Vue.js project
* 构建过程
* 安装过程
* 差异点
* 打包优化


## 构建过程
```bash
bogon:vue-cli caoke$ vue init webpack template

? Project name template
? Project description A Vue.js project
? Author caoke <caoke@caoke.com>
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? No
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recommended) npm

   vue-cli · Generated "template".


# Installing project dependencies ...
# ========================
```

## 1、安装过程

``` bash
# 安装依赖
npm install

# 启动热服务 localhost:8080
npm run dev

# 压缩打包
npm run build

# 压缩打包 and 查看打包分析图
npm run build --report
```
### 2、差异点
2-1:新建目录
```
/src/api 服务接口口请求
/src/assets png、js、css资源存放
/src/common 公用资源
/src/components 项目内部组件
/src/directive vue指令
/src/entry 入口js
/src/marvel 第三份公用组件库
/src/models 数据模型
/src/router 路由
/src/utils 公用工具
/src/views 页面

```
2-2:package.json
```
  "axios": "^0.18.0",
  "element-ui": "^2.3.8",
  "glob": "^7.1.2",
  "less": "^3.0.2",
  "less-loader": "^4.1.0",
  "node-sass": "^4.9.0",
  "photoswipe": "^4.1.2",
  "qs": "^6.5.2",
  "sass-loader": "^7.0.1",
  "stylus": "^0.54.5",
  "stylus-loader": "^3.0.2",
  "text-loader": "^0.0.1",
  "vue-markdown": "^2.2.4",
```

2-3:webpack.prod.conf.js 自动配置entry，看打包优化部分
```
const test = require('./better');

const entry=test.getproEntry()
const htmlConfig=test.getproHtmlWebpack();
const commonsConfig=test.getCommonsChunk();

 entry: entry,

   chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')

    ...htmlConfig,
    ...commonsConfig,

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks (module) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         path.join(__dirname, '../node_modules')
    //       ) === 0
    //     )
    //   }
    // }),

   // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   minChunks: Infinity
    // }),

```
2-4:webpack.dev.conf.js 自动配置entry
```
const test = require('./better');

const entry=test.getdevEntry()

const htmlConfig=test.getdevHtmlWebpack();

  entry: entry,

 ...htmlConfig,


```
2-4:vue-loader.conf.js
```
esModule: false
```

2-5:config/index.js
```
const productName = require('../package').name||'template';
 dev: {

    // Paths
    assetsSubDirectory: productName,
    assetsPublicPath: '/',
    proxyTable: {
      /*
      域名:https://www.easy-mock.com/
      用户名:caoke
      密码:123456
      * */
      '/api': {
        target: 'https://www.easy-mock.com/', // 接口的域名
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '/api': '/mock/596f19b1a1d30433d837ad7d/example'
        }
      }

    },


  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../../dist/'+productName+'/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../../dist'),
    assetsSubDirectory: productName,
    assetsPublicPath: '/',


productionSourceMap: false,

```

## 3、自动配置和打包优化
* 3-1:根据entry目录，自动配置入口和html，以dev开头的文件不会发布到生产环境
* 3-2:在better.js手动配置公共的js，格式如下
```
const commonConfig={
  'demo':['demo1','demo2'],//demo1、demo2的公共demo.js
  // 'vendor':true,//所有页面的公共demo.js
}
```

build/better.js

```
//打包优化配置
const glob = require('glob');
const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const productName = require('../package').name||'template';
//公共模块的配置
const commonConfig={
  'demo':['demo1','demo2'],//demo1、demo2的公共demo.js
  // 'vendor':true,//所有页面的公共demo.js
}
function getCommonsChunk() {
  const data=[]
  for(let name in commonConfig){
    if(Array.isArray(commonConfig[name])){
      data.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: name,
          minChunks:2,
          chunks:commonConfig[name]
        }))
    }else if(commonConfig[name]===true){
      data.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: name,
          minChunks:2,
          children: true,
        }))
    }
  }
  return data;
}

function getCommonBy(name) {
  const commons=[]
  for(let name in commonConfig){
    if(commonConfig[name]===true){
      commons.push(name)
    }else if(commonConfig[name].indexOf(name)>-1){
      commons.push(name)
    }
  }
  return commons;
}
/*
  获取入口entry的所有js文件
 */
function getdevEntry() {
  const arr = glob.sync(__dirname+'/../src/entry/*.js')
  const entry={}
  arr.forEach(function (file) {
    file.replace(/([^/]+)\.[a-z]+$/,function (m,p1) {
      entry[p1]=file
    })
  })
  return entry;
}
function getproEntry() {
  const arr = glob.sync(__dirname+'/../src/entry/!(dev)*.js')
  const entry={}
  arr.forEach(function (file) {
    file.replace(/([^/]+)\.[a-z]+$/,function (m,p1) {
      entry[p1]=file
    })
  })
  return entry;
}

/*
  生产html配置
 */
function getdevHtmlWebpack() {
  const entry=getdevEntry();
  const htmlConfig=[]
  for(let name in entry){
    htmlConfig.push(new HtmlWebpackPlugin({
      title:name,
      filename: name+'.html',
      template: 'index.html',
      inject: true,
      chunks:[name],
      chunksSortMode: 'dependency'
    }))
  }
  return htmlConfig;
}
function getproHtmlWebpack() {
  const entry=getproEntry();
  const htmlConfig=[]

  for(let name in entry){
    const cmchunks=getCommonBy(name);
    htmlConfig.push(new HtmlWebpackPlugin({
      title:name,
      filename: path.resolve(__dirname, '../../dist/'+productName+'/'+name+'.html'),
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        // collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunks:[name,...cmchunks],
      chunksSortMode: 'dependency'
    }))
  }
  return htmlConfig;
}
module.exports={
  getdevEntry,//自动配置开发环境入口
  getproEntry,//自动配置生产环境入口
  getdevHtmlWebpack,//自动配置开发环境html
  getproHtmlWebpack,//自动配置生产环境入口
  getCommonsChunk,//自动配置生产环境公共资源
};


```
