<template>
  <div class="post-list">
    <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment">
    </CommentItem>
  </div>
</template>

<script>
import CommentItem from '../components/CommentItem.vue'
export default {
  name: 'userRepliesPage',
  data(){
    return {
      comments: []
    }
  },
  components: { CommentItem },
  async mounted(){
    const userId = this.$store.state.userAbout.otherUserData.id || this.$store.getters.loginedUserId
    if (userId) {
      const { data } = await this.$axios.get(`${this.$store.state.API_URL}/comments/recent/${userId}`)
      console.log('@@@',data)
      this.comments = data
      return
    }
    const { data } = await this.$axios.get(`${this.$store.state.API_URL}/comments/recent/${userId}`)

    this.comments = data
  }
}
</script>