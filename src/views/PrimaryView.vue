<template>
  <div class="primary">
    <pageInfoBar/>
    <div class="post-input-group">
      <img src="./../assets/images/default-avatar.jpg" alt="avatar" class="avatar">
      <textarea placeholder="有什麼新鮮事?"></textarea>
      <button>推文</button>
    </div>
    <!-- PostItem 之後有資料串時 v-for -->
    <div class="postList">
      <PostItem/>
      <PostItem/>
      <PostItem/>
      <PostItem/>
      <PostItem/>
      <PostItem/>
      <PostItem/>
      <PostItem/>
    </div>
  </div>
</template>

<script>
import pageInfoBar from './../components/pageInfoBar.vue'
import PostItem from './../components/PostItem.vue'

export default {
  data(){
    return {
      postList: []
    }
  },
  components: {pageInfoBar,PostItem}
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

.primary {
  padding-left: 1.6rem;
  padding-right: 1.6rem;
}

.post-input-group {
  height: 12.5rem;
  border-bottom: 5px solid $color-gray-400;
  padding-top: 1.5rem;
}

button {
  width: 7.5rem;
  padding: 1rem 1.25rem;
  display: block;
  margin-left: auto;
  margin-top: auto;
}

textarea {
  font-size: 1.8rem;
  width: 70%;
  color: $color-gray-500;
  font-weight: bold;
  resize: none;
  overflow-y: hidden;
  padding-left: 1rem;
  border: none;
  outline: none;

  &:focus {
    color: $color-gray-900;
  }
}

.postList {
  height: 71.5rem;
  overflow-y: scroll;
}

</style>