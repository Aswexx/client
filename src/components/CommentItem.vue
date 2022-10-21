<template>
  <div class="comment" @click="toCommentDetail(comment, attachComments)">
    <img class="comment__avatar" :src="comment.author.avatarUrl" />

    <div class="comment__contents">
      <span class="comment__title">
        <b>{{ comment.author.name }}</b>
        {{ comment.author.alias }}．{{ timeRelativeToNow }}</span
      >
      <p v-if="comment.onPost">
        回覆
        <!-- <button @click.stop="toProfilePage(comment.onPost.author.id)">
          @{{ comment.onPost.author.alias }}
        </button> -->
        <button
          @click.stop="toPostDetail(comment.onPost)"
        >
          @{{ comment.onPost.author.alias }}
        </button>
      </p>
      <div>{{ comment.contents }}</div>
      <template v-if="comment.media">
        <img
          v-if="comment.media.type !== 'video/mp4'"
          :src="comment.media.url"
        />
        <video
          v-else
          autoplay
          :src="comment.media.url"
          @click="togglePlay"
        ></video>
      </template>
    </div>
    <div
      class="comment__interact"
      v-if="comment.onCommentId || this.$route.name === 'post-detail'"
    >
      <a @click.stop="triggerModal(comment)">
        <svg>
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"
          ></use>
        </svg>
        <span>{{ attachComments.length }}</span>
      </a>
      <a @click.stop="toggleCommentLike(comment)">
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
        <span>{{ likesNum }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  data() {
    return {
      isLike: false,
      likesNum: this.comment.liked.length,
      attachComments: [],
      isTitleComment: false
    }
  },
  props: {
    comment: {
      type: Object
    },
    postInfo: {
      type: Object
    },
    commentTitleId: {
      type: String
    }
  },
  computed: {
    timeRelativeToNow() {
      return this.$toNow(this.$parseISO(this.comment.createdAt), {
        addSuffix: true,
        locale: this.$zhTW
      })
    }
  },
  methods: {
    togglePlay(event) {
      const video = event.target
      console.log(video)
      if (video.paused || video.ended) {
        video.play()
      } else {
        video.pause()
      }
    },
    toggleCommentLike(comment) {
      const isLike = !this.isLike
      const commentInfo = {
        commentId: comment.id,
        isLike
      }

      if (this.postInfo) {
        commentInfo.postId = this.postInfo.postId
      }

      // * seperately controls the display about numbers of likes
      // * in order to make display properly when user trigger refresh
      this.isLike = !this.isLike
      if (this.isLike) {
        this.likesNum++
      } else {
        this.likesNum--
      }
      this.$store.dispatch('commentAbout/toggleCommentLike', commentInfo)
    },
    triggerModal(comment) {
      comment = { ...comment, modalType: 'replyComment' }
      this.$store.commit('TOGGLE_MODAL', comment)
    },
    toCommentDetail(comment, attachComments) {
      this.$router
        .push({
          name: 'comment-detail',
          params: { comment, attachComments }
        })
        .catch(() => {
          this.$emit('setAsTopicComment', comment, attachComments)
        })
    },
    async toProfilePage(userId) {
      alert(userId)
      await this.$store.dispatch('userAbout/getUser', userId)
      await this.$store.dispatch('postAbout/getUserPosts', userId)
      this.$router.push({
        name: 'posts',
        params: { userId }
      })
    },
    async toPostDetail(post){
      this.$router.push({
        name: 'post-detail',
        params: { post }
      })
    }
  },
  async created() {
    if (
      this.comment.id &&
      this.comment.id !== this.$store.getters.topicComment.id
    ) {
      await this.$store.dispatch(
        'commentAbout/getAttachComments',
        this.comment.id
      )
      this.attachComments = this.$store.getters.attachComments[this.comment.id]
    }
  },
  mounted() {
    this.isLike = this.comment.liked.some(
      (like) => {
        const userId = like.userId || like.user.id
        return userId === this.$store.getters.loginedUserId
      }
    )
  }
}
</script>

<style lang="scss" scoped>

.comment {
  border-bottom: 1px solid $color-gray-400;
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-column-gap: 1.5rem;
  grid-row-gap: 1rem;
  cursor: pointer;

  &__title {
    display: inline-block;
    padding-bottom: 0.5rem;
  }
}

.comment__interact {
  grid-column: 2/3;
  width: 30%;
  display: flex;
  justify-content: space-between;
  a {
    cursor: pointer;
  }
  svg {
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 1rem;
  }
}
</style>