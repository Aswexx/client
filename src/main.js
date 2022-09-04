import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import axios from 'axios'
// import './registerServiceWorker'

Vue.config.productionTip = false
axios.defaults.withCredentials = true

new Vue({
  router,
  render: (h) => h(App),
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
