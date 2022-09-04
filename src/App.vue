<template>
  <div id="app">
    <router-view />
    <div class="toast-container">
      <ToastNotification />
    </div>
  </div>
</template>

<script>
import ToastNotification from './components/ToastNotification.vue'
export default {
  components: { ToastNotification }
}
</script>

<style lang="scss">
@import './assets/scss/base.scss';
</style>