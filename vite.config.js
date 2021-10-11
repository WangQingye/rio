import vue from '@vitejs/plugin-vue'
import path from 'path'
export default {
    base: './',
    resolve: {
        alias: {
            "@": path.resolve(__dirname, 'src'),
        }
    },
    plugins: [vue()],
    optimizeDeps: {
        include: ['schart.js']
    }
}