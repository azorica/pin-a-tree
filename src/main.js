import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import Leaflet CSS globally
import 'leaflet/dist/leaflet.css'

// Create Vue application
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)

// Mount the app
app.mount('#app')
