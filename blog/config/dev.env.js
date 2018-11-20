'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const productName = require('../package').name||'template';
module.exports = merge(prodEnv, {
  buildTime:JSON.stringify(new Date().toLocaleString()),
  productName: '"'+productName+'"',
  STAGE: JSON.stringify(process.env.STAGE),
  baseURL: '"/'+productName+'"',

})
