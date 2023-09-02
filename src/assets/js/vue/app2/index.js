import { createApp } from "vue"
import App2 from "./App2.vue"
const app2 = createApp(App2)
const root = document.querySelector('#app2')
root && app2.mount('#app2')