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
        v-for="attachComment in attachComments"
        :key="attachComment.id"
        :comment="attachComment"
        @setAsTopicComment="setAsTopicComment"
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
      attachComments: this.$store.getters.attachComments[this.$store.getters.topicComment.id],
      isLike: ''
    }
  },
  computed: {
    // attachComments() {
    //   return this.$store.getters.attachComments[this.comment.id]
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
    setAsTopicComment(comment, attachComments) {
      this.$store.commit('commentAbout/SET_TOPIC_COMMENT', comment)
      this.comment = comment
      // * set as falsy so that title comment of deep comment page wont show icons of interaction
      this.comment.onCommentId = ''
      this.attachComments = attachComments
    }
  },
  beforeCreate() {
    this.$store.commit('commentAbout/RESET_ATTACH_COMMENTS')
  },
  beforeMount() {
    const topicComment =
      this.$route.params.comment ||
      JSON.parse(sessionStorage.getItem('storeData')).commentAbout.topicComment

    const attachComments =
      this.$route.params.attachComments ||
      JSON.parse(sessionStorage.getItem('storeData')).commentAbout
        .attachComments[topicComment.id]

    this.$store.commit('commentAbout/SET_TOPIC_COMMENT', topicComment)
    this.$store.commit('commentAbout/SET_ATTACH_COMMENTS', {
      commentId: topicComment.id,
      attachComments: attachComments
    })

    this.comment = topicComment
    this.attachComments = this.$store.getters.attachComments[topicComment.id]
    this.isLike = topicComment.liked.some(
      (like) => like.userId === this.$store.getters.loginedUserId
    )
  },
  beforeDestroy() {
    this.$store.commit('commentAbout/RESET_TOPIC_COMMENT')
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