<template>
  <div class="reply">
    <img
      alt="avatar"
      class="avatar"
      :src="$store.state.userAbout.loginedUserData.avatar.url"
    />
    <EmojiInput ref="emojiInput" />
    <div class="upload-wrapper">
      <svg class="upload-img" @click="showFilePicker('image/png, image/jpeg')">
        <use xlink:href="./../assets/images/symbol-defs.svg#icon-images"></use>
      </svg>
      <svg class="upload-film" @click="showFilePicker('video/mp4,video/x-m4v')">
        <use xlink:href="./../assets/images/symbol-defs.svg#icon-film"></use>
      </svg>
      <button @click="submitContents">
        {{ $store.state.modalType === 'reply' ? '回覆' : '推文' }}
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
    }
  },
  methods: {
    submitContents() {
      const emojiInput = this.$refs.emojiInput
      const contentsToSubmit = new FormData()

      contentsToSubmit.append(
        'authorId',
        this.$store.state.userAbout.loginedUserData.id
      )
      contentsToSubmit.append('contents', emojiInput.input)
      contentsToSubmit.append('file', emojiInput.fileToUpload)

      emojiInput.input = ''
      emojiInput.fileToUpload = ''
      emojiInput.cancelUpload()

      if (!this.postId) {
        return this.$store.dispatch('postAbout/submitNewPost', contentsToSubmit)
      }

      contentsToSubmit.append('postId', this.postId)
      this.$store.dispatch('commentAbout/submitComment', contentsToSubmit)
    },
    showFilePicker(fileType) {
      this.$refs.emojiInput.showFilePicker(fileType)
    }
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