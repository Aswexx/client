<template>
  <div>
    <PageInfoBar/>
    <PostItem class="post"
      :post="post"
    />
    <div class="info">
      <span>發表於 {{ post.createdAt }}</span>
      <span v-if="post.liked">{{ post.liked.length }} 個人喜歡</span>
    </div>

    <div class="interact">
      <a href="#">
        <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"></use></svg>
      </a>
      <a>
        <svg>
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-heart-normal"></use>
        </svg>
        <svg class="heart-icon"
          v-if="isLike"
        >
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-heart-solid"></use>
        </svg>
      </a>
    </div>

    <div class="reply">
      <img alt="avatar" class="avatar"
        :src="$store.state.userAbout.loginedUserData.avatar.url"
      >
      <EmojiInput
        ref="emojiInput"
      />
      <button @click="reply">回覆</button>
    </div>

    <div class="comment-list">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>

  </div>
</template>

<script>
import PageInfoBar from './../components/PageInfoBar'
import PostItem from './../components/PostItem'
import CommentItem from './../components/CommentItem'
import EmojiInput from './../components/EmojiInput'
export default {
  name: 'PostDetailPage',
  data() {
    return {
      post: {},
      isLike: false
    }
  },
  computed: {
    comments(){
      return this.post.comments
    },
  },
  components: { PageInfoBar, PostItem, CommentItem, EmojiInput },
  methods: {
    reply(){
      const contentsInfo = {
        authorId: this.$store.state.userAbout.loginedUserData.id,
        postId: this.post.id,
        contents: this.$refs.emojiInput.input,
      }
      this.$refs.emojiInput.input = ''
      this.$store.dispatch('commentAbout/submitComment', contentsInfo)
    },
  },
  mounted(){
    this.post = this.$route.params.post
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/abstracts.scss';
  div {
    padding: 1rem;
  }

  .info {
    border-bottom: 1px solid $color-gray-400;
    span {
      display: inline-block;
      margin-right: 1rem;
    }
  }

  .interact {
    border-bottom: 1px solid $color-gray-400;
    width: 50%;
    display: flex;
    justify-content: space-around;
    svg {
      width: 2rem;
      height: 2rem;
      cursor: pointer;
    }
  }

  .reply {
    display: grid;
    grid-template-columns: 10% 90%;

    button {
      width: 8rem;
      grid-column: 2/-1;
      margin-left: auto;
    }
  }

</style>