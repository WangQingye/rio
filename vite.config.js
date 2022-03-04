import vue from '@vitejs/plugin-vue'
import path from 'path'
export default {
  base: './',
  // build: {
  //   sourcemap: true
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
    }
  },
  plugins: [vue()],
  optimizeDeps: {
    include: ['schart.js']
  },
  // 本地运行配置，及反向代理配置
  server: {
    cors: true, // 默认启用并允许任何源
    //反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
    proxy: {
      '/serverBackend': {
        // target: 'http://162.14.79.68/serverBackend', //代理接口
        // target: 'http://uatsmart.pigkeeping.cn', //代理接口
        // target: 'http://web.dev4.smartpig.bajietong.net', //代理接口
        target: 'http://162.14.79.68/serverBackend_test', //代理接口
        // target: 'http://162.14.79.68', //代理接口
        // target: 'http://172.16.0.138:8090', //代理接口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/serverBackend/, '')
      },
      // '/serverBackend': {
      //   target: 'http://162.14.79.68', //代理接口
      //   // target: 'http://162.14.79.68/serverBackend_test', //代理接口
      //   // target: 'http://162.14.79.68', //代理接口
      //   // target: 'http://172.16.0.138:8090', //代理接口
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // }
    }
  }
}