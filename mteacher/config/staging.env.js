'use strict'
module.exports = {
  buildTime:JSON.stringify(new Date().toLocaleString()),
  NODE_ENV: '"staging"',
  STAGE: JSON.stringify(process.env.STAGE),
  baseUrl:'"//zy.staging.17zuoye.net"',
  zxBaseUrl:'"//zx.staging.17zuoye.net/"',
  apiBaseUrl:'"//api.staging.17zuoye.net/"'
}

