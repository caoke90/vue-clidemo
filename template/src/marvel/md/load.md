
## demo
• http://140.143.245.118/

## 源码
• http://gitlab.17zuoye.net/ke.cao/vue-cli


# 搭建过程
### 1、安装 vue-cli 脚手架

1-1:npm install --global vue-cli

1-2:vue init webpack vuetest

1-3:
```
bogon:17zuoye caoke$ vue init webpack zxonline

? Project name zxonline
? Project description A Vue.js project
? Author
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? No
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recom
mended) npm
```

### 2、差异点
2-1:src目录覆盖

2-2:package.json
```
  "axios": "^0.18.0",
  "element-ui": "^2.3.8",
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

2-3:webpack.base.conf.js
```
  app: './src/entry/main.js',
  test: './src/entry/test.js'

  {
    test: /\.md$/,
    use: [
      {
        loader: "text-loader"
      }
    ]
  },
```

2-4:vue-loader.conf.js
`esModule: false`

### 3、安装、运行
3-1:npm install
3-2:npm run dev
