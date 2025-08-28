import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import helper from './helper'

// import '@/assets/scss/globals.scss'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.js"


let meamaObserveApp = createApp(App).use(store).use(router);
meamaObserveApp.config.globalProperties.$helper = helper;
meamaObserveApp.mount('#app');
