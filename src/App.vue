<template>
  <div id="app">
    <router-view />
    <ToastNotification />
  </div>
</template>

<script>
import ToastNotification from './components/ToastNotification.vue'
export default {
  components: { ToastNotification },
  created() {
    if (sessionStorage.getItem('storeData')) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('storeData'))
        )
      )
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('storeData', JSON.stringify(this.$store.state))
    })
  }
}
</script>

<style lang="scss">
@import './assets/scss/base.scss';
#app {
  position: relative;
  border: 1px solid red;
}
</style>