//打包优化配置
const glob = require('glob');
const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const productName = require('../package').name||'template';
//公共模块的配置
const commonConfig=getcommons();

function getcommons(){
  const obj=getproEntry();
  const commonConfig={}
  for(let ke in obj){
    ke.replace(/([a-z]+)\./i,function (m,p1) {
      if(!commonConfig[p1]){commonConfig[p1]=[];}
      commonConfig[p1].push(ke)
    })
  }
  return commonConfig;
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
//获取生产环境入口配置
function getproEntry() {
  const arr = glob.sync(__dirname+'/../src/entry/!(dev.)*.js')
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
