<template>
  <div class="post-item" v-if="post" @click="toPostDetail(post)">
    <img
      class="avatar"
      alt="avatar"
      v-if="post.author"
      :src="post.author.avatarUrl"
      @error="setAltImg"
    />
    <div class="interact">
      <template v-if="post.author">
        <span
          ><b>{{ post.author.name }}</b
          >@{{ post.author.alias }} ‧ {{ timeRelativeToNow }}</span
        >
      </template>
      <span v-if="isUserOwn" @click.stop="deletePost">
        <svg v-if="$route.name === 'home'">
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use>
        </svg>
      </span>
    </div>
    <p class="post-contents">
      {{ post.contents }}
    </p>

    <template v-if="post.media">
      <img
        class="post-img"
        alt="post-img"
        v-if="/image\//.exec(post.media.type)"
        :src="post.media.url"
        :hidden="!isShowMedia && $store.getters.loginedUser.role === 'admin'"
      />
      <div v-else class="video-wrapper">
        <video
          controls
          :src="post.media.url"
          alt="post-video"
          ref="video"
          :hidden="!isShowMedia && $store.getters.loginedUser.role === 'admin'"
          @click.stop=""
        ></video>
      </div>
    </template>

    <div class="count" v-if="$route.name !== 'post-detail'">
      <button @click.stop="showReplyModal(post)">
        <svg>
          <use
            xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"
          ></use>
        </svg>
        <span>{{ post.comments.length }}</span>
      </button>
      <button @click.stop="togglePostLike(post)">
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
        <span>{{ post.liked.length }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostItem',
  data() {
    return {
      isLike: false,
      isVideoPaused: true
    }
  },
  props: {
    post: {
      type: Object
    },
    isShowMedia: {
      type: Boolean
    }
  },
  computed: {
    timeRelativeToNow() {
      return this.$toNow(this.$parseISO(this.post.createdAt), {
        addSuffix: true,
        locale: this.$zhTW
      })
    },
    isUserOwn() {
      if (this.post.author) {
        return this.post.author.id === this.$store.getters.loginedUserId
      }
      return ''
    },
  },
  methods: {
    setAltImg(event){
      if (event.target.className === 'user-bg') {
        event.target.src = require('@/assets/images/default-profile-bg.jpg')
        return
      }
      event.target.src = require('@/assets/images/default_avatar1.png')
    },
    showReplyModal(post) {
      post = {
        ...post,
        timeRelativeToNow: this.timeRelativeToNow,
        modalType: 'replyPost'
      }
      this.$store.commit('TOGGLE_MODAL', post)
    },
    togglePostLike(post) {
      const isLike = !this.isLike
      this.isLike = !this.isLike
      this.$store.dispatch('postAbout/togglePostLike', {
        postId: post.id,
        isLike
      })
    },
    deletePost() {
      // TODO:optimize notification
      if (!confirm('確定刪除?')) return
      this.$store.dispatch('postAbout/deletePost', this.post.id)
    },
    toPostDetail(post) {
      if (this.$route.name === 'post-detail') return
      this.$router.push({
        name: 'post-detail',
        params: { post }
      })
    },
  },
  mounted() {
    if (this.post) {
      this.isLike = this.post.liked.some(
        (like) => like.userId === this.$store.getters.loginedUserId
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

.post-item {
  min-height: 12rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  cursor: pointer;

  display: grid;
  grid-template-columns: min-content auto;
  grid-column-gap: 1rem;
  grid-row-gap: 0.5rem;

  border-bottom: 1px solid $color-gray-400;
  .avatar {
    grid-row: 1/4;
  }

  .post-img {
    width: 90%;
    height: unset;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 10px;
  }

  background-color: $color-gray-100;
  transition: all 0.2s ease-in;

  &:hover {
    background-color: rgba($color-brand, 0.4);
    .controls {
      transform: translateY(0%);
    }
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

p.home-page {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
}

.interact {
  display: flex;
  justify-content: space-between;

  b {
    padding-right: 1rem;
  }

  span:nth-of-type(2) {
    margin-right: 1.5rem;
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
  }
}

.count {
  width: 12rem;
  display: flex;
  justify-content: space-between;
  grid-column: 2/-1;

  span {
    padding-left: 0.5rem;
  }

  a,
  button {
    display: flex;
    align-items: center;
  }
}

svg {
  width: 1.6rem;
  height: 1.6rem;
}

button {
  width: 4.2rem;
  padding: 0;
  background-color: transparent;
  color: $color-gray-700;
}

a {
  text-decoration: none;
  color: $color-gray-900;
}

.heart-icon {
  fill: crimson;
}
</style>