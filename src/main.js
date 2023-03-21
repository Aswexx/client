import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import axios from 'axios'
import { io } from 'socket.io-client'

import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { format } from 'date-fns'
import { parseISO } from 'date-fns/esm/fp'
import { zhTW } from 'date-fns/locale'
import { v4 as uuidv4 } from 'uuid'

Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios

Vue.prototype.$io = io
Vue.prototype.$toNow = formatDistanceToNow
Vue.prototype.$parseISO = parseISO
Vue.prototype.$format = format
Vue.prototype.$zhTW = zhTW
Vue.prototype.$uuid = uuidv4

const isIOSdevice = navigator.userAgent.match(/iPhone|iPad|iPod/i)
store.state.API_URL = process.env.VUE_APP_API_URL

if (isIOSdevice) {
  store.state.isIOSdevice = true
}

axios.interceptors.request.use(
  (config) => {
    if (
      (isIOSdevice && config.url.includes('/post')) ||
      (isIOSdevice && config.url.includes('/auth'))
    ) {
      config.headers['Authorization'] = `Bearer ${store.state.accessToken}`
    } 
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    if (isIOSdevice && response.config.url.includes('/posts')) {
      store.state.accessToken = response.data.iosAccessToken
      delete response.data.iosAccessToken
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

new Vue({
  router,
  render: (h) => h(App),
  store
}).$mount('#app')
