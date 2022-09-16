<template>
  <div>
    <PageInfoBar />
    <CommentItem class="comment" :comment="comment" />
    <div class="info">
      <span>發表於 {{ formattedTime }}</span>
      <span v-if="comment.liked">{{ comment.liked.length }} 個人喜歡</span>
    </div>

    <div class="interact">
      <a @click="showModal(comment)">
        <svg>
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"
          ></use>
        </svg>
      </a>
      <a @click="likePost(comment)">
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

    <ContentPoster :commentId="comment.id" />

    <div class="comment-list">
      <CommentItem
        v-for="comment in attatchComments"
        :key="comment.id"
        :comment="comment"
        @setMain="setMain"
      />
      <!-- :postInfo="{ author: post.author, postId: post.id }" -->
    </div>
  </div>
</template>

<script>
import PageInfoBar from './../components/PageInfoBar'
import CommentItem from './../components/CommentItem'
import ContentPoster from './../components/ContentPoster'
export default {
  name: 'CommentDetailPage',
  data() {
    return {
      comment: {},
      attatchComments: [],
      isLike: ''
    }
  },
  computed: {
    // attatchComments() {
    //   return this.$store.state.commentAbout.attatchComments
    // },
    // showingPosts() {
    //   return this.$store.state.postAbout.showingPosts
    // },
    // comments() {
    //   const index = this.showingPosts.indexOf(this.post)
    //   return this.showingPosts[index].comments
    // },
    formattedTime() {
      return this.$format(
        new Date(this.comment.createdAt),
        'yyyy-MM-dd HH:mm:ss',
        { locale: this.$zhTW }
      )
    }
  },
  components: { PageInfoBar, CommentItem, ContentPoster },
  methods: {
    showModal(comment) {
      this.$refs.comment.showReplyModal(comment)
    },
    likeComment(comment) {
      const isLike = !this.isLike
      this.isLike = isLike
      this.$store.dispatch('postAbout/togglePostLike', {
        commentId: comment.id,
        isLike
      })
    },
    setMain(comment, attatchComments) {
      this.comment = comment
      this.attatchComments = attatchComments
    },
  },
  beforeMount() {
    this.comment = this.$route.params.comment
    this.attatchComments = this.$route.params.attatchComments
    this.isLike = this.comment.liked.some(
      (like) => like.userId === this.$store.getters.loginedUserId
    )
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/abstracts.scss';
div {
  padding: 1rem;
}

svg {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.info {
  border-bottom: 1px solid $color-gray-400;
  span {
    display: inline-block;
    margin-right: 1rem;
  }
}

.interact {
  width: 50%;
  display: flex;
  justify-content: space-around;
}
</style>