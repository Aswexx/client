<template>
  <div class="reply">
    <img
      alt="avatar"
      class="avatar"
      :src="$store.getters.loginedUser.avatarUrl"
      @error="setAltImg"
    />
    <!-- :src="$store.state.userAbout.loginedUserData.avatar.url" -->
    <EmojiInput ref="emojiInput" />
    <div class="upload-wrapper">
      <svg class="upload-img" @click="showFilePicker('image/png, image/jpeg')">
        <use xlink:href="./../assets/images/symbol-defs.svg#icon-images"></use>
      </svg>
      <svg class="upload-film" @click="showFilePicker('video/mp4,video/x-m4v')">
        <use xlink:href="./../assets/images/symbol-defs.svg#icon-film"></use>
      </svg>
      <button @click="submitContents">
        {{
          $store.state.modalType === 'replyPost' ||
          $route.name === 'post-detail'
            ? '回覆'
            : '推文'
        }}
      </button>
    </div>
  </div>
</template>

<script>
import EmojiInput from './../components/EmojiInput'
export default {
  components: { EmojiInput },
  props: {
    postId: {
      type: String
    },
    commentId: {
      type: String
    },
    source: {
      type: Object
    }
  },
  methods: {
    submitContents() {
      const emojiInput = this.$refs.emojiInput
      const contentsToSubmit = new FormData()

      contentsToSubmit.append(
        'authorId',
        this.$store.getters.loginedUserId
      )
      contentsToSubmit.append('contents', emojiInput.input)
      contentsToSubmit.append('file', emojiInput.fileToUpload)

      emojiInput.input = ''
      emojiInput.fileToUpload = ''
      emojiInput.cancelUpload()

      // * reply comment in comment detail page
      if (this.$route.name === 'comment-detail' && !this.source) {
        const commentId = this.commentId || this.source.id
        contentsToSubmit.append('commentId', commentId)
        return this.$store.dispatch(
          'commentAbout/submitComment',
          contentsToSubmit
        )
      }

      // * submit post
      if (!this.source || !this.source.id) {
        if (this.postId) {
          contentsToSubmit.append('postId', this.postId)
          return this.$store.dispatch(
            'commentAbout/submitComment',
            contentsToSubmit
          )
        }
        return this.$store.dispatch('postAbout/submitNewPost', contentsToSubmit)
      }

      // * home page reply post
      if (this.source.modalType === 'replyPost') {
        contentsToSubmit.append('postId', this.source.id)
        return this.$store.dispatch(
          'commentAbout/submitComment',
          contentsToSubmit
        )
      }

      // * reply comment via action modal
      if (this.source.modalType === 'replyComment') {
        contentsToSubmit.append('commentId', this.source.id)
        return this.$store.dispatch(
          'commentAbout/submitComment',
          contentsToSubmit
        )
      }
    },
    showFilePicker(fileType) {
      this.$refs.emojiInput.showFilePicker(fileType)
    },
    setAltImg(event) {
      event.target.src = require('@/assets/images/default_avatar1.png')
    }
  }
}
</script>

<style lang="scss" scoped>

div {
  padding: 1rem;
}

svg {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.reply {
  border-top: 1px solid $color-gray-400;
  border-bottom: 1px solid $color-gray-400;
  display: grid;
  grid-template-columns: min-content 90%;
}

.upload-wrapper {
  grid-column: 2/-1;
  display: flex;
  align-items: center;
  svg {
    margin-right: 2rem;
    fill: $color-brand;
  }
  button {
    width: 8rem;
    margin-left: auto;
  }
}
</style>