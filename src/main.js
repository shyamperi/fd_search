import axios from 'axios'
import VueAxios from 'vue-axios'
import VueProgressBar from 'vue-progressbar'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(VueAxios, axios, VueProgressBar)
app.mount('#app')
