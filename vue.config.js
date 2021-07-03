const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "http://127.0.0.1:5001/",
  //       timeout: 6000,
  //       secure: false,
  //       changeOrigin: true
  //     }
  //   }
  // }
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        { from: 'node_modules/oidc-client/dist/oidc-client.min.js', to: 'js' }
    ])
    ],
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
