<template>
  <div class="post-list">
    <CommentItem 
      v-for="comment in $store.state.commentAbout.userRecentComments"
      :key="comment.id" 
      :comment="comment">
    </CommentItem>
  </div>
</template>

<script>
import CommentItem from '../components/CommentItem.vue'
export default {
  name: 'userRepliesPage',
  components: { CommentItem },
  async beforeCreate(){
    const userId = this.$store.state.userAbout.otherUserData.id || this.$store.getters.loginedUserId
    if (userId) {
      await this.$store.dispatch('commentAbout/getUserRecentComments', userId)
    }
  }
}
</script>