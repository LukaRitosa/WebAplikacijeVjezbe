import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css';
// app/pizza-vue/src/main.js
import { OhVueIcon } from 'oh-vue-icons';
import axios from 'axios'


const token = sessionStorage.getItem('jwt')

if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const app = createApp(App)

app.component('v-icon', OhVueIcon); // mapiraj OhVueIcon komponentu na "v-icon" HTML tag
app.use(router)

app.mount('#app')
