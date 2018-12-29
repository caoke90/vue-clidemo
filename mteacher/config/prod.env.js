'use strict'
module.exports = {
  buildTime:JSON.stringify(new Date().toLocaleString()),
  NODE_ENV: '"production"',
  STAGE: JSON.stringify(process.env.STAGE),
  baseUrl:'"//zy.17zuoye.com"',
  zxBaseUrl:'"//zx.17zuoye.com/"',
  apiBaseUrl:'"//api.17zuoye.com/"'
}

