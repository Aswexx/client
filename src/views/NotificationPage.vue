<template>
  <div>
    <PageInfoBar />

    <div class="notification-list" v-for="notif in notifications" :key="notif.id">
      <NotificationItem :notif="notif" />
    </div>

  </div>
</template>

<script>
import PageInfoBar from '../components/PageInfoBar.vue'
import NotificationItem from '../components/NotificationItem.vue'
export default {
  computed: {
    notifications() {
      return this.$store.state.notifications
    }
  },
  components: { PageInfoBar, NotificationItem },
  beforeDestroy(){
    sessionStorage.setItem('storeData', JSON.stringify(this.$store.state))
  }
}
</script>

<style lang="scss"></style>