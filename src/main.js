import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
// import './assets/sw'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then((reg) => console.log('設定完成', reg))
    .catch((err) => console.log('註冊失敗', err))
}

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
