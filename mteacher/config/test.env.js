'use strict'
module.exports = {
  buildTime:JSON.stringify(new Date().toLocaleString()),
  NODE_ENV: '"test"',
  STAGE: JSON.stringify(process.env.STAGE),
  baseUrl:'"//zy.test.17zuoye.net"',
  zxBaseUrl:'"//zx.test.17zuoye.net/"',
  apiBaseUrl:'"//api.test.17zuoye.net/"'
}

