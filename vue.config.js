const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/scss/_abstracts.scss";
        `
      }
    }
  },
  devServer: {
    https: {
      key: fs.readFileSync('./192.168.0.103-key.pem'),
      cert: fs.readFileSync('./192.168.0.103.pem')
    },
  }
})
