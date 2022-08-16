import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
// import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
