import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import global styles
import './styles/variables.css'
import './styles/base.css'
import './styles/components.css'

// Create Vue app
const app = createApp(App)

// Create Pinia instance
const pinia = createPinia()

// Use Pinia
app.use(pinia)

// Mount app
app.mount('#app')
