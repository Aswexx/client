<template>
  <div>
    <PageInfoBar> </PageInfoBar>
    <VueLoadImage>
      <img
        class="user-bg"
        alt="user-bg"
        slot="image"
        :src="showingUserData.bgImage.url"
      />
      <div slot="preloader" class="user-bg">
        <LoadSpinner />
      </div>
      <div slot="error">error!!</div>
    </VueLoadImage>
    <div class="profile-card">
      <img alt="img" :src="showingUserData.avatar.url" />

      <div class="interact">
        <button @click="triggerChat(showingUserData.id)">
          <svg>
            <use xlink:href="../assets/images/symbol-defs.svg#icon-chat"></use>
          </svg>
        </button>
        <button v-show="!isLoginUser" @click="email">
          <svg class="">
            <use xlink:href="../assets/images/symbol-defs.svg#icon-email"></use>
          </svg>
        </button>
        <button
          v-show="!isLoginUser"
          :class="{ followed: isfollowed }"
          @click="toggleFollow"
        >
          <svg v-if="!isfollowed">
            <use xlink:href="../assets/images/symbol-defs.svg#icon-bell"></use>
          </svg>
          <svg v-else>
            <use
              xlink:href="../assets/images/symbol-defs.svg#icon-followed"
            ></use>
          </svg>
        </button>
        <button :class="{ end: isLoginUser }">
          編輯個人資料
        </button>
      </div>

      <div class="profile-info">
        <h5>{{ showingUserData.name }}</h5>
        <span>@{{ showingUserData.alias }}</span>
        <p>{{ showingUserData.bio }}</p>
        <div class="follows">
          <span>{{ showingUserData.follow.length }} 個跟隨中</span>
          <span>{{ showingUserData.followed.length }} 位追隨者</span>
        </div>
      </div>
    </div>

    <div class="profile-nav">
      <router-link to="/profile/posts" active-class="active">推文</router-link>
      <router-link to="/profile/replies" active-class="active"
        >回覆</router-link
      >
      <router-link to="/profile/likes" active-class="active"
        >喜歡的內容</router-link
      >
    </div>

    <router-view></router-view>
    <div class="post-list">
      <PostItem v-for="post in userPosts" :key="post.id" :post="post">
      </PostItem>
    </div>
  </div>
</template>

<script>
import PageInfoBar from '../components/PageInfoBar.vue'
import PostItem from '../components/PostItem.vue'
import VueLoadImage from 'vue-load-image'
import LoadSpinner from '../components/LoadSpinner.vue'

export default {
  data() {
    return {
      isLoginUser: false,
      isfollowed: true
    }
  },
  components: { PageInfoBar, PostItem, VueLoadImage, LoadSpinner },
  computed: {
    showingUserData() {
      if (!this.$store.state.userAbout.otherUserData.id) {
        return this.$store.state.userAbout.loginedUserData
      } else {
        return this.$store.state.userAbout.otherUserData
      }
    },
    userPosts() {
      return this.$store.state.postAbout.userPosts
    }
  },
  methods: {
    toggleFollow() {
      this.isfollowed = !this.isfollowed
    },
    email() {
      window.location.href =
        'mailto:a284ru8ccc@gmail.com?subject=你好啊&body=yoyoyo%0Ahey~~&cc=anita888@gmail.com'
    },
    triggerChat(targetUserId) {
      this.$store.dispatch('sendChatNotification', targetUserId)
      // * use logined user id as roomId to specify the chat room allow target user to join
      this.$store.commit(
        'TOGGLE_CHAT',
        this.$store.getters.loginedUserId
      )
    }
  },
  async created() {
    // * no route params means user try to see own profile
    const userId =
      this.$route.params.userId || 
      // * if unload on profile page
      JSON.parse(sessionStorage.get('storeData')).postAbout.userPosts[0].author.id ||
      this.$store.getters.loginedUserId
    await this.$store.dispatch('userAbout/getUser', userId)
    await this.$store.dispatch('postAbout/getUserPosts', userId)
  },
  destroyed() {
    this.$store.state.userAbout.otherUserData = {}
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/abstracts.scss';

.post-list {
  overflow-y: scroll;
  height: 43vh;
}

.user-bg {
  display: block;
  border-radius: 0;
  width: 100%;
  height: 20rem;

  object-fit: cover;
  object-position: 0 80%;

  div {
    margin-top: 10%;
  }
}

.profile-card {
  position: relative;
  margin-top: 1.6rem;
  img {
    vertical-align: middle;
    width: 14rem;
    height: 14rem;
    transform: translate(1.5rem, -8.6rem);
    border: 5px solid $color-gray-100;
  }
}

.interact {
  width: 50%;
  border: 1px solid blue;
  position: absolute;
  top: 0;
  right: 1.2rem;
  display: flex;
  justify-content: space-between;

  button {
    width: 4rem;
    height: 4rem;
    padding: 0;
    background: $color-gray-100;
    color: $color-brand;
    border: 1px solid $color-brand;

    &:last-child {
      width: 13rem;
    }

    &:hover {
      background-color: $color-brand;
      color: $color-gray-100;

      svg {
        fill: $color-gray-100;
      }
    }

    &.end {
      margin-left: auto;
    }
    &.followed {
      background-color: $color-brand;
      svg {
        fill: $color-gray-100;
      }
    }
  }

  svg {
    width: 2.4rem;
    height: 2.4rem;
    fill: $color-brand;
  }
}

.profile-info {
  margin-top: -7.6rem;
  margin-bottom: 2rem;
  height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  span {
    color: $color-gray-400;
  }
  .follows {
    span {
      display: inline-block;
      margin-right: 2rem;
      color: $color-gray-900;
    }
  }
}

a {
  font-weight: bold;
  color: $color-gray-600;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: 13rem;
  padding-bottom: 1rem;
}

.active {
  color: $color-brand;
  border-bottom: 2px solid $color-brand;
}
</style>