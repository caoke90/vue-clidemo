'use strict'
const productName = require('../package').name||'template';
module.exports = {
  buildTime:JSON.stringify(new Date().toLocaleString()),
  productName: '"'+productName+'"',
  STAGE: JSON.stringify(process.env.STAGE),
  baseURL: '"/'+productName+'"',
}

