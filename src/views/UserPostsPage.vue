<template>
  <div class="post-list">
    <PostItem v-for="post in userPosts" :key="post.id" :post="post">
    </PostItem>
  </div>
</template>

<script>
import PostItem from '../components/PostItem.vue'
export default {
  name: 'UserPosts',
  components: { PostItem },
  props: ['userPosts'],
}
</script>