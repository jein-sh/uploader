import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import InlineSvg from 'vue-inline-svg'
import './style.css'

const app = createApp(App)
app.component('inline-svg', InlineSvg)
app.use(createPinia())
app.use(router)
app.mount('#app')
