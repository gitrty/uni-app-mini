module.exports = {
  // 生产环境的 source map
  productionSourceMap: false,
  // 配置alias
  configureWebpack: {
    resolve: {
      alias: {
        '@api': '@/api',
        '@pages': '@/pages',
        '@components': '@/components'
      }
    }
  }
}
