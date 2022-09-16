<template>
  <div @click="direct(notif)">
    <img src="../assets/images/default_avatar1.png" alt="avatar" />
    <span>{{ description }}</span>
  </div>
</template>

<script>
export default {
  methods: {
    async direct(notif) {
      switch (notif.notifType) {
        case 'follow':
          this.$router.push({
            name: 'posts',
            params: { userId: notif.informerId }
          })
          break
        case 'inviteChat':
          this.$store.commit('TOGGLE_CHAT', notif.informerId)
          break
        case 'replyPost':
        case 'likePost':
          // eslint-disable-next-line no-case-declarations
          const { data } = await this.$store.dispatch(
            'postAbout/getPost',
            notif.targetPostId
          )
          this.$router.push({
            name: 'post-detail',
            params: { post: data }
          })
          break
        case 'likeComment':
          alert('go to comment detail')
          break
      }
    }
  },
  computed: {
    description() {
      const notif = this.notif
      switch (notif.notifType) {
        case 'follow':
          return `${notif.informer.name} 追蹤了你`
        case 'inviteChat':
          return `${notif.informer.name} 邀請你進入聊天`
        case 'replyPost':
          return `${notif.informer.name} 評論了你的貼文`
        case 'likePost':
          return `${notif.informer.name} 喜歡你的貼文`
        case 'likeComment':
          return `${notif.informer.name} 喜歡你的評論`
        default:
          return ''
      }
    }
  },
  props: {
    notif: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  cursor: pointer;
}
</style>