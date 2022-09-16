<template>
  <div class="comment" @click="toCommentDetail(comment, attatchComments)">
    <img class="comment__avatar" :src="comment.author.avatar.url" />

    <div class="comment__contents">
      <span class="comment__title">
        <b>{{ comment.author.name }}</b>
        {{ comment.author.alias }}．{{ timeRelativeToNow }}</span
      >
      <p>
        回覆
        <button @click.stop="toProfilePage()">
          <!-- @{{ postInfo.author.alias }} -->
          @someOne
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
    <!-- v-if="$route.name !== 'comment-detail'" -->
    <div class="comment__interact">
      <a @click.stop="triggerModal(comment)">
        <svg>
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"
          ></use>
        </svg>
        <span>{{ attatchComments.length }}</span>
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
        <span>{{ comment.liked.length }}</span>
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
      attatchComments: []
    }
  },
  props: {
    comment: {
      type: Object
    },
    postInfo: {
      type: Object
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
      this.isLike = !this.isLike
      this.$store.dispatch('commentAbout/toggleCommentLike', {
        postId: this.postInfo.postId,
        commentId: comment.id,
        isLike
      })
    },
    triggerModal(comment) {
      comment = { ...comment, modalType: 'replyComment' }
      this.$store.commit('TOGGLE_MODAL', comment)
    },
    toCommentDetail(comment, attatchComments) {
      this.$router
        .push({
          name: 'comment-detail',
          params: { comment, attatchComments }
        })
        .catch(() => {
          this.$emit('setMain', comment, attatchComments)
        })
    },
    toProfilePage() {
      this.$router.push({
        name: 'posts',
        params: { userId: this.postInfo.author.id }
      })
    },
    async getAttatchComments(commentId) {
      this.attatchComments = await this.$store.dispatch(
        'commentAbout/getAttatchComments',
        commentId
      )
    },
  },
  async mounted() {
    await this.getAttatchComments(this.comment.id)
    

    // TODO:fix
    this.isLike = this.comment.liked.some(
      (like) => like.userId === this.$store.getters.loginedUserId
    )
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/abstracts.scss';

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