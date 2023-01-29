<template>
  <div class="notif-page">
    <PageInfoBar />

    <div class="notification-list">
      <NotificationItem v-for="notif in notifications" :key="notif.id" :notif="notif" />
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
}
</script>

<style lang="scss" scoped>
.notif-page {
  height: 98vh;
}
.notification-list {
  height: 90%;
  overflow-y: auto;
}
</style>