import { createApp } from 'vue'
import App from './App.vue'
import directives from './directives'

const app = createApp(App)
app.use(directives)
app.mount('#app')
