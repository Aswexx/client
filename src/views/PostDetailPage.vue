<template>
  <div class="post-detail">
    <PageInfoBar />
    <PostItem class="post" :post="post" ref="post" />
    <div class="info">
      <span>{{ formattedTime }} 發布 </span>
      <span v-if="post.liked">
        有<b class="info__num-of-like" 
            @click="showConditionUserList"
            >{{ post.liked.length }}</b>個人喜歡
      </span>

      <ConditionUserList
        v-show="isListActivated"
        :userIdList="likedByUsers"
      />
      
      <a @click="togglePostLike(post)">
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

    <ContentPoster :postId="post.id" />

    <div class="comment-list">
      <CommentItem
        v-for="comment in post.comments"
        :key="comment.id"
        :comment="comment"
        :postInfo="{ author: post.author, postId: post.id }"
      />
    </div>
  </div>
</template>

<script>
import PageInfoBar from './../components/PageInfoBar'
import PostItem from './../components/PostItem'
import CommentItem from './../components/CommentItem'
import ContentPoster from './../components/ContentPoster'
import ConditionUserList from './../components/ConditionUserList'
export default {
  name: 'PostDetailPage',
  data() {
    return {
      post: {},
      isLike: '',
      // isListActivated: false
    }
  },
  computed: {
    formattedTime() {
      const post = this.post || this.$store.getters.tempPost
      return this.$format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm:ss', {
        locale: this.$zhTW
      })
    },
    likedByUsers() {
      return this.post.liked.map(like => like.userId)
    },
    isListActivated() {
      return this.$store.state.isConditionUserListActivated
    }
  },
  components: { PageInfoBar, PostItem, CommentItem, ContentPoster, ConditionUserList },
  methods: {
    showModal(post) {
      this.$refs.post.showReplyModal(post)
    },
    showConditionUserList() {
      this.$store.state.isConditionUserListActivated = true
    },
    // closeList() {
    //   this.isListActivated = false
    // },
    togglePostLike(post) {
      const isLike = !this.isLike
      this.isLike = isLike
      this.$store.dispatch('postAbout/togglePostLike', {
        postId: post.id,
        isLike
      })

      if (isLike) {
        this.post.liked.push({ userId: this.$store.getters.loginedUserId })
      } else {
        const like = this.post.liked.find(like => like.userId === this.$store.getters.loginedUserId)
        const likeIndex = this.post.liked.indexOf(like)
        this.post.liked.splice(likeIndex, 1)
      }
    }
  },
  beforeCreate() {
    this.$store.commit('commentAbout/RESET_ATTACH_COMMENTS')
  },
  beforeMount() {
    const showingPosts = this.$store.getters.showingPosts
    this.post =
      this.$route.params.post ||
      showingPosts.find((post) => post.id === this.$store.getters.tempPost.id)

    this.isLike = this.post.liked.some(
      (like) => like.userId === this.$store.getters.loginedUserId
    )
  },
  mounted() {
    this.$store.commit('postAbout/SAVE_TEMP_POST', this.post)
  }
}
</script>

<style lang="scss" scoped>

.post-detail {
  height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
}

.comment-list {
  overflow-y: auto;
}

div {
  padding: 1rem;
}

svg {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.heart-icon {
  fill: crimson;
}

.info {
  display: flex;
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

</style>
