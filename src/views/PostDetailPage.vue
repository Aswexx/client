<template>
  <div>
    <PageInfoBar />
    <PostItem class="post" :post="post" ref="post" />
    <div class="info">
      <span>{{ formattedTime }} 發布 </span>
      <span v-if="post.liked">有 {{ post.liked.length }} 個人喜歡</span>
      <a @click="likePost(post)">
        <svg v-if="!isLike">
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-heart-normal"
          ></use>
        </svg>
        <svg class="heart-icon" v-else>
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-heart-solid"
          ></use>
        </svg>
      </a>
    </div>

    <ContentPoster :postId="post.id" />

    <div class="comment-list">
      <CommentItem
        v-for="comment in post.comments"
        :key="comment.id"
        :comment="comment"
        :postInfo="{ author: post.author, postId: post.id }"
      />
    </div>
  </div>
</template>

<script>
import PageInfoBar from './../components/PageInfoBar'
import PostItem from './../components/PostItem'
import CommentItem from './../components/CommentItem'
import ContentPoster from './../components/ContentPoster'
export default {
  name: 'PostDetailPage',
  data() {
    return {
      post: {},
      isLike: ''
    }
  },
  computed: {
    formattedTime() {
      const post = this.post || this.$store.getters.tempPost
      return this.$format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm:ss', {
        locale: this.$zhTW
      })
    }
  },
  components: { PageInfoBar, PostItem, CommentItem, ContentPoster },
  methods: {
    showModal(post) {
      this.$refs.post.showReplyModal(post)
    },
    likePost(post) {
      const isLike = !this.isLike
      this.isLike = isLike
      this.$store.dispatch('postAbout/togglePostLike', {
        postId: post.id,
        isLike
      })
    }
  },
  beforeCreate() {
    this.$store.commit('commentAbout/RESET_ATTACH_COMMENTS')
  },
  beforeMount() {
    const showingPosts = this.$store.getters.showingPosts
    this.post =
      this.$route.params.post ||
      showingPosts.find((post) => post.id === this.$store.getters.tempPost.id)

    this.isLike = this.post.liked.some(
      (like) => like.userId === this.$store.getters.loginedUserId
    )
  },
  mounted() {
    this.$store.commit('postAbout/SAVE_TEMP_POST', this.post)
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
  height: 53vh;
  overflow-x: auto;
}

div {
  padding: 1rem;
}

svg {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.info {
  display: flex;
  border-bottom: 1px solid $color-gray-400;
  span {
    margin-right: 1.5rem;
  }

  a {
    margin-left: auto;
  }
}

</style>
