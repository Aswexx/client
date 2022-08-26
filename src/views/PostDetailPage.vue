<template>
  <div>
    <PageInfoBar />
    <PostItem class="post" :post="post" ref="post" />
    <div class="info">
      <span>發表於 {{ post.createdAt }}</span>
      <span v-if="post.liked">{{ post.liked.length }} 個人喜歡</span>
    </div>

    <div class="interact">
      <a @click="showModal(post)">
        <svg>
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"
          ></use>
        </svg>
      </a>
      <a>
        <svg>
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-heart-normal"
          ></use>
        </svg>
        <svg class="heart-icon" v-if="isLike">
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-heart-solid"
          ></use>
        </svg>
      </a>
    </div>

    <!-- <div class="reply">
      <img
        alt="avatar"
        class="avatar"
        :src="$store.state.userAbout.loginedUserData.avatar.url"
      />
      <EmojiInput ref="emojiInput" />
      <div class="upload-wrapper">
        <svg
          class="upload-img"
          @click="showFilePicker('image/png, image/jpeg')"
        >
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-images"
          ></use>
        </svg>
        <svg
          class="upload-film"
          @click="showFilePicker('video/mp4,video/x-m4v')"
        >
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-film"></use>
        </svg>
        <svg @click="emitEmojiPicker">
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-emoji"></use>
        </svg>
        <button @click="reply">回覆</button>
      </div>
    </div> -->
    <ContentPoster :postId="post.id" />

    <div class="comment-list">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :postAuthor="post.author"
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
      isLike: false
    }
  },
  computed: {
    comments() {
      return this.post.comments
    }
  },
  components: { PageInfoBar, PostItem, CommentItem, ContentPoster },
  methods: {
    showModal(post) {
      this.$refs.post.showReplyModal(post)
    },
  },
  mounted() {
    this.post = this.$route.params.post
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