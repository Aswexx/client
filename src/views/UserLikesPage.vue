<template>
  <div class="post-list">
    <PostItem 
      v-for="post in likePosts" 
      :key="post.id"
      :post="post"
      v-on:cancelLike="cancelLike"
    > </PostItem>
  </div>
</template>

<script>
import PostItem from '../components/PostItem.vue'
export default {
  name: 'UserLikesPage',
  components: { PostItem },
  computed: {
    likePosts() {
      return this.$store.state.postAbout.userLikePosts
    }
  },
  methods: {
    cancelLike(postId) {
      this.likePosts = this.likePosts.filter(post => post.id !== postId)
    }
  },
  async beforeCreate() {
    const userId =
      this.$store.state.userAbout.otherUserData.id ||
      this.$store.getters.loginedUserId
    // if (userId) {
    //   const { data } = await this.$axios.get(
    //     `${this.$store.state.API_URL}/posts/likes/${userId}`
    //   )
    //   this.likePosts = data.map(obj => obj.post)
    //   return
    // }
    // const { data } = await this.$axios.get(
    //   `${this.$store.state.API_URL}/posts/likes/${userId}`
    // )

    // this.likePosts = data.map(obj => obj.post)
    await this.$store.dispatch('postAbout/getUserLikePosts', userId)
  }
}
</script>
