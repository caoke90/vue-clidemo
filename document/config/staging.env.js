'use strict'
const productName = require('../package').name||'template';
module.exports = {
  buildTime:JSON.stringify(new Date().toLocaleString()),
    NODE_ENV: '"staging"',
  productName: '"'+productName+'"',
    STAGE: JSON.stringify(process.env.STAGE),
    zybaseURL:'"//zy.staging.17zuoye.net/"',
    wwwbaseURL:'"//www.staging.17zuoye.net"',
    zxbaseURL:'"//zx.staging.17zuoye.net"',
    centerbaseURL:'"//ucenter.staging.17zuoye.net'
}

