import { createApp } from 'vue'

import App from '@/App.vue'
import { router } from '@/router'

import '@/styles.css'

document.documentElement.dataset.todoTheme = 'light'

createApp(App).use(router).mount('#app')
