import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.console = console
console.log(app.config.globalProperties)

app.mount('#app')
