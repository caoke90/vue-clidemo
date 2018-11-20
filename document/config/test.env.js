'use strict'
const productName = require('../package').name||'template';
module.exports = {
  buildTime:JSON.stringify(new Date().toLocaleString()),
    NODE_ENV: '"test"',
  productName: '"'+productName+'"',
    STAGE: JSON.stringify(process.env.STAGE),
    zybaseURL:'"//zy.test.17zuoye.net/"',
    wwwbaseURL:'"//zy.test.17zuoye.net/"',
    zxbaseURL:'"//zx.test.17zuoye.net"',
    centerbaseURL:'"//ucenter.test.17zuoye.net"'
}
