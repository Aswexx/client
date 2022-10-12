<template>
  <div id="app">
    <router-view />
    <ToastNotification />
    <div class="bg-video" v-show="$route.name === 'login'">
      <video src="@/assets/bg-video.mp4" autoplay loop></video>
    </div>
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
}

.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -999;
  width: 100%;
  height: 100%;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>