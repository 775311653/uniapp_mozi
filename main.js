import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from '@/store'
import './uni.promisify.adaptor'
import api from '@/api';

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  store,
  ...App
})

Vue.prototype.$api = api; // 设置全局的 $api

app.$mount()
// #endif

// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}

// #endif
