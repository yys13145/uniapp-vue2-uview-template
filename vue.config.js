// vue.config.js，如没有此文件则手动创建
module.exports = {
  transpileDependencies: ["uview-ui"],
  devServer: {
    // proxy: {
    //   "/auth": {
    //     target: "http://10.166.1.31:30200", //设置你调用的接口域名和端口号 别忘了加http
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/auth": "", //这里理解成用‘/auth’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/auth/user/add’即可
    //     },
    //   },
    //   '/apie': {
    //     target: 'http://10.166.1.47:8083',//设置你调用的接口域名和端口号 别忘了加http
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/apie': ''
    //     }
    //   },
    // },
  },
}
