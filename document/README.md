# 构建过程
### 1、安装 vue-cli 脚手架

1-1:npm install --global vue-cli

1-2:vue init webpack zxonline

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

2-5:config/index.js
```
productionSourceMap: false,

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
```

### 3、安装、运行
3-1:npm install
3-2:npm run dev
