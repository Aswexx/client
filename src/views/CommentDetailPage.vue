<template>
  <div>
    <PageInfoBar />
    <div class="comment-target">
      <PostItem class="post" :post="commentTarget"/>
    </div>

    <div class="parent-comments">
      <CommentItem class="comment"
        v-for="comment in parentComments"
        :key="comment.id"
        :comment="comment"
        @setAsTopicComment="setAsTopicComment"
      />
    </div>

    <!-- <CommentItem class="comment" :comment="comment" /> -->
    <div class="info">
      <span>{{ formattedTime }} 發布 </span>
      <span>
        有<b class="info__num-of-like"
            @click="showUserLikeList"
            >{{ comment.liked.length }}</b>個人喜歡這則評論
      </span>

      <UserLikeList
        v-show="isListActivated"
        :likes="comment.liked"
        v-on:closeList="closeList"
      />
      
      <a>
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


    <ContentPoster :commentId="comment.id" @submitNewComment="updateAttachComments"/>

    <div class="comment-list">
      <CommentItem
        v-for="attachComment in attachComments"
        :key="attachComment.id"
        :comment="attachComment"
        v-on:removeComment="removeComment"
        @setAsTopicComment="setAsTopicComment"
      />
    </div>
  </div>
</template>

<script>
import PageInfoBar from './../components/PageInfoBar'
import PostItem from './../components/PostItem'
import CommentItem from './../components/CommentItem'
import ContentPoster from './../components/ContentPoster'
import UserLikeList from './../components/UserLikeList'

export default {
  name: 'CommentDetailPage',
  data() {
    return {
      comment: {},
      attachComments: this.$store.getters.attachComments[this.$store.getters.topicComment.id],
      isLike: '',
      commentTarget: {},
      sourcePost: {},
      isListActivated: false
    }
  },
  computed: {
    formattedTime() {
      return this.$format(
        new Date(this.comment.createdAt),
        'yyyy-MM-dd HH:mm:ss',
        { locale: this.$zhTW }
      )
    },
    parentComments() {
      return this.$store.state.commentAbout.parentComments
    }
  },
  components: { PageInfoBar, PostItem, CommentItem, ContentPoster, UserLikeList },
  methods: {
    showUserLikeList() {
      if (!this.comment.like.length) return
      this.isListActivated = true
    },
    closeList() {
      this.isListActivated = false
    },
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
    },
    removeComment(commentId) {
      this.attachComments = this.attachComments.filter(comment => comment.id !== commentId)
    },
    updateAttachComments(newComment) {
      if (this.attachComments.find(newComment)) return
      this.attachComments.unshift(newComment)
    }
  },
  beforeCreate() {
    this.$store.commit('commentAbout/RESET_ATTACH_COMMENTS')
  },
  async beforeMount() {
    console.log('receive:' ,this.$route.params)
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
    this.attachComments = attachComments
    this.isLike = topicComment.liked.some(
      (like) => like.userId === this.$store.getters.loginedUserId
    )

    const targetPostId = this.comment.postId || this.comment.onPost?.id

    if (!targetPostId) {
      const onCommentId = this.comment.onCommentId
      const { data } = await this.$axios.get(`${this.$store.state.API_URL}/comments/${onCommentId}`)
      this.commentTarget = data

      if (data.postId) {
        const sourcePost = this.$store.getters.showingPosts.find(post => post.id === data.postId)
        this.sourcePost = sourcePost
      }
      return
    }

    const targetPost = this.$store.getters.showingPosts.find(post => post.id === targetPostId)
    this.commentTarget = targetPost || this.comment.onPost
  },
  beforeDestroy() {
    this.$store.commit('commentAbout/RESET_TOPIC_COMMENT')
  },
  beforeRouteLeave(_to,_from, next) {
    this.$store.commit('commentAbout/RESET_PARENT_COMMENTS')
    next()
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
  border-top: 1px solid $color-gray-400;
  border-bottom: 1px solid $color-gray-400;
  span {
    margin-right: 1.5rem;
  }

  a {
    margin-left: auto;
  }

  &__num-of-like {
    color: $color-primary;
    padding: 0 1rem;
    text-decoration: underline;
    text-underline-offset: .5rem;
    cursor: pointer;
  }
}

.heart-icon {
  fill: crimson;
}

@mixin vertical-line($height, $top, $left) {
  &::after {
    position: absolute;
    top: $top;
    left: $left;
    content: "";
    display: block;
    width: .25rem;
    height: $height;
    background-color: $color-gray-400;
    
  }
}

.comment-target {
  position: relative;
  @include vertical-line(60%, 7rem, 4.5rem);
  .post {
    border-bottom: none;
  }
}

.parent-comments {
  .comment {
    position: relative;
    border-bottom: none;
  }
  .comment:not(:last-child) {
    @include vertical-line(40%, 6.5rem, 3.5rem)
  }
}
</style>