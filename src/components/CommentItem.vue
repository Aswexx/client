<template>
  <div class="comment" @click="toCommentDetail(comment, attachComments, parentComments)">
    <img class="comment__avatar"
      :src="comment.author.avatarUrl"
      @error="setAltImg"
    />

      <svg class="comment__delete-icon"
        v-if="comment.authorId === $store.getters.loginedUserId"
        @click.stop="deleteComment(comment.id)"
      >
        <use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use>
      </svg>


    <div class="comment__contents">
      <span class="comment__title">
        <b>{{ comment.author.name }}</b>
        {{ comment.author.alias }}．{{ timeRelativeToNow }}</span
      >
      <div class="taged-users" v-if="comment.mention && comment.mention.length">
        <span 
          v-for="(mention, index) in comment.mention" :key="index"
          @click.stop="toUserProfile(mention.mentionedUserId)"
        >@{{ mention.mentionedUser.alias }}</span>
      </div>

      <i v-if="this.$route.name === 'replies'">
        對<span>{{ authorAlias }}</span>{{ comment.onPost ? '貼文': '評論' }}的評論
      </i>

      <div>{{ comment.contents }}</div>
      <template v-if="comment.media">
        <img
          class="comment__img"
          v-if="comment.media.type !== 'video/mp4'"
          :src="comment.media.url"
        />
        <div v-else class="comment__video" @click.stop="">
          <video
            controls
            :src="comment.media.url"
          ></video>
        </div>
      </template>
    </div>

    <div
      class="comment__interact"
        v-if="this.$route.name !== 'replies' && !isTopicComment"
      >
      <a @click.stop="triggerModal(comment)">
        <svg>
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"
          ></use>
        </svg>
        <span>{{ commentByCommentsCount }}</span>
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
      likesNum: this.comment.liked.length || 0,
      parentComments: [],
      attachComments: [],
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
    },
    authorAlias() {
      if (this.comment.onPost) {
        return this.comment.onPost.author.alias
      }
      return this.comment.onComment.author.alias
    },
    isTopicComment() {
      return this.comment.id === this.$store.getters.topicComment.id
    },
    isFirstLevelComment() {
      return Object.hasOwn(this.comment, 'onPost')
    },
    commentByCommentsCount() {
      if (this.comment._count) {
        return this.comment._count.commentByComments
      }
      return 0
    }
  },
  methods: {
    setAltImg(event){
      if (event.target.className === 'user-bg') {
        event.target.src = require('@/assets/images/default-profile-bg.jpg')
        return
      }
      event.target.src = require('@/assets/images/default_avatar1.png')
    },
    deleteComment(commentId) {
      if (confirm('確定刪除?')) {
        this.$store.dispatch('commentAbout/deleteComment', commentId)
      }

      this.$emit('removeComment', commentId)
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
    toCommentDetail(comment, attachComments, parentComments) {
      this.$store.commit('commentAbout/TRACE_PARENT_COMMENTS', comment)
      console.log('before push', attachComments)
      this.$router
        .push({
          name: 'comment-detail',
          params: { comment, attachComments, parentComments }
        })
        .catch(() => {
          this.$emit('setAsTopicComment', comment, attachComments)
        })
    },
    async toProfilePage(userId) {
      await this.$store.dispatch('userAbout/getUser', userId)
      await this.$store.dispatch('postAbout/getUserPosts', userId)
      this.$router.push({
        name: 'posts',
        params: { userId }
      })
    },
    toUserProfile(userId) {
      this.$router.push({
        name: 'posts',
        params: { userId }
      })
    }
  },
  async created() {
    if (
      this.comment.id &&
      this.comment.id !== this.$store.getters.topicComment.id
    ) {
      if (!this.comment._count?.commentByComments) return
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

    if (this.isFirstLevelComment) {
      this.attachComments = this.$store.getters.attachComments[this.comment.id] || []
    }
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

  position: relative;

  &__title {
    display: inline-block;
    padding-bottom: 0.5rem;
  }

  &__img {
    width: 90%;
    height: unset;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 10px;
  }

  &__video {
    width: 90%;

    video {
      aspect-ratio: 16/9;
      object-fit: cover;
      border-radius: 1.5rem;
    }
  }

  &__delete-icon {
    width: 1.25rem;
    height: 1.25rem;

    position: absolute;
    top: .5rem;
    right: 1rem;
  }

  @include respond($bp-mobile) {
    display: flex;
    flex-direction: column;
    &__avatar {
      display: none;
    }
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

.video-wrapper {
  width: 90%;

  video {
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 1.5rem;
  }
}

.taged-users {
  color: $color-primary;

  span {
    padding-right: .5rem;
  }

  span:hover {
    text-decoration: underline;
  }
}

.heart-icon {
  fill: crimson;
}


</style>