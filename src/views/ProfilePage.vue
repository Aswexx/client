<template>
  <div class="profile-page">
    <PageInfoBar class="page-info"> </PageInfoBar>
    <VueLoadImage>
      <img
        class="user-bg"
        alt="user-bg"
        slot="image"
        :src="showingUserData.bgImageUrl"
      />
      <div slot="preloader" class="user-bg">
        <LoadSpinner />
      </div>
      <div slot="error">
        <img class="user-bg" src="@/assets/images/default-profile-bg.jpg" />
      </div>
    </VueLoadImage>
    <div class="profile-card">
      <img alt="img" :src="showingUserData.avatarUrl" @error="useFallbackImg" />

      <div class="interact" :class="{ 'not-logined-user': !isLoginedUser }">
        <button @click="triggerChat(showingUserData)">
          <svg>
            <use xlink:href="../assets/images/symbol-defs.svg#icon-chat"></use>
          </svg>
        </button>
        <button
          v-show="!isLoginedUser"
          :class="{ followed: isFollowed }"
          @click="toggleFollow"
        >
          <svg v-if="!isFollowed">
            <use xlink:href="../assets/images/symbol-defs.svg#icon-bell"></use>
          </svg>
          <svg v-else>
            <use
              xlink:href="../assets/images/symbol-defs.svg#icon-followed"
            ></use>
          </svg>
        </button>
        <button v-show="isLoginedUser" @click="toSettingPage">
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

    <router-view :userPosts="userPosts"></router-view>
  </div>
</template>

<script>
import PageInfoBar from '../components/PageInfoBar.vue'
import VueLoadImage from 'vue-load-image'
import LoadSpinner from '../components/LoadSpinner.vue'

export default {
  name: 'ProfilePage',
  components: { PageInfoBar, VueLoadImage, LoadSpinner },
  computed: {
    isFollowed() {
      if (!Object.hasOwn(this.$store.state.userAbout.otherUserData, 'id'))
        return undefined
      const loginedUserId = this.$store.state.userAbout.loginedUserData.id
      const followers = this.$store.state.userAbout.otherUserData.followed
      // * convert array of observer to array of object
      const parsedFollowers = JSON.parse(JSON.stringify(followers))

      return (
        parsedFollowers.find(
          (follower) => follower.followerId === loginedUserId
        ) !== undefined
      )
    },
    isLoginedUser() {
      return this.showingUserData.id === this.$store.getters.loginedUserId
    },
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
    async toggleFollow() {
      if (!this.isFollowed) {
        const newFollowship = await this.$axios.post(
          `${this.$API_URL}/users/follow`,
          {
            followerId: this.$store.getters.loginedUserId,
            followedId: this.showingUserData.id
          }
        )
        this.$store.commit('userAbout/UPDATE_FOLLOWSHIP', newFollowship.data)
      } else {
        const followshipToRemove = this.showingUserData.followed.find(e => e.followerId === this.$store.getters.loginedUserId)
        await this.$axios.delete(`${this.$API_URL}/users/follow/${followshipToRemove.id}`)
        this.$store.commit('userAbout/UPDATE_FOLLOWSHIP')
      }
    },
    triggerChat(targetUser) {
      this.$store.dispatch('sendChatNotification', targetUser.id)
      this.$store.commit('TRIGGER_CHAT', {
        loginedUserId: this.$store.getters.loginedUserId,
        targetUser
      })
    },
    toSettingPage() {
      this.$router.push({ name: 'setting' })
    },
    useFallbackImg(event) {
      if (event.target.className === 'user-bg') {
        event.target.src = require('@/assets/images/default-profile-bg.jpg')
      } else {
        event.target.src = require('@/assets/images/default_avatar1.png')
      }
    }
  },
  async created() {
    // * no route params means user try to see own profile
    let userId
    try {
      userId =
        this.$route.params.userId ||
        // * load session data if unload on profile page
        JSON.parse(sessionStorage.getItem('storeData')).postAbout.userPosts[0]
          .author.id ||
        this.$store.getters.loginedUserId
    } catch {
      userId = this.$store.getters.loginedUserId
    }

    await this.$store.dispatch('userAbout/getUser', userId)
    await this.$store.dispatch('postAbout/getUserPosts', userId)
  },
  destroyed() {
    this.$store.state.userAbout.otherUserData = {}
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  @include respond($bp-tablet) {
    margin-top: 1rem;
    .page-info {
      display: none;
    }
  }
}

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
  width: 30%;
  &.not-logined-user {
    width: 25%;
  }
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
  display: grid;
  grid-template-columns: 60% 40%;
  overflow-y: hidden;

  &:hover {
    overflow-y: unset;
    p {
      display: block;
      overflow: unset;
      box-shadow: 1rem 1rem 2rem 0 #2278a0;
      background-color: $color-gray-100;
    }
  }
  span {
    color: $color-gray-400;
  }
  p {
    grid-column: 1 / 3;
    grid-row: 3 / 4;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .follows {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    justify-self: end;
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
