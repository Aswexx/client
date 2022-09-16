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

// import './registerServiceWorker'

Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$io = io
Vue.prototype.$toNow = formatDistanceToNow
Vue.prototype.$parseISO = parseISO
Vue.prototype.$format = format
Vue.prototype.$zhTW = zhTW

new Vue({
  router,
  render: (h) => h(App),
  store
}).$mount('#app')
