<template>
  <div id="app">
    <router-view />
    <ToastNotification/>
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

      sessionStorage.clear()
    }

    window.addEventListener('beforeunload', () => {
      delete this.$store.state.notifSocket
      delete this.$store.state.chatSocket
      delete this.$store.state.isIOSdevice
      delete this.$store.state.viewport
      delete this.$store.state.isChatActivated
      delete this.$store.state.chatRoomId
      delete this.$store.state.currentChatTarget
      delete this.$store.state.currentMsgCollection
      delete this.$store.state.chatTargetList

      const storeData = JSON.stringify(this.$store.state)
      sessionStorage.setItem('storeData', storeData)
    })

    // * watch user change OS color theme
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQueryList.addEventListener('change', (event) => {
      this.$store.state.useDarkTheme = event.target.matches
    })
  }
}
</script>

<style lang="scss">
@import './assets/scss/base.scss';
</style>