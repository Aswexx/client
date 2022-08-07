const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: './../server/public',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
})
