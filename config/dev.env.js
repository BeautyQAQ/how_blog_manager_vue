/* 'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://101.201.142.43:9011"',
}) */


module.exports = {
  NODE_ENV: '"development"',
  BASE_API: '"/api"',
}