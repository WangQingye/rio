import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
import {
    defineAsyncComponent
} from 'vue'
const MyButton = defineAsyncComponent(() =>
    import('@/components/MyButton.vue'))
const app = createApp(App)
installElementPlus(app)
app.component('my-button', MyButton)
app
    .use(store)
    .use(router)
    .mount('#app')