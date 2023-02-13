// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '': {
        target: '',
        pathRewrite: {
          '^/prefix': 'https://mp-4e6f1c48-a4dc-4897-a866-0a1a071023c3.cdn.bspapp.com'
        }
      }
    },
  }
}