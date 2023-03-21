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
        <button v-if="!isLoginedUser" @click="triggerChat(showingUserData)">
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
          <span><b @click="showUserList('following')">{{ showingUserData.follow.length }}</b>個關注中</span>
          <span><b @click="showUserList('followedBy')">{{ showingUserData.followed.length }}</b>位關注者</span>
        </div>
      </div>

      <ConditionUserList
        v-show="isListActivated"
        :userIdList="userIdList"
      />
    </div>

    <div class="profile-nav">
      <router-link to="/profile/posts" active-class="active">貼文</router-link>
      <router-link to="/profile/replies" active-class="active"
        >回覆</router-link
      >
      <router-link to="/profile/likes" active-class="active"
        >喜歡的貼文</router-link
      >
    </div>

    <router-view :userPosts="userPosts"></router-view>
  </div>
</template>

<script>
import PageInfoBar from '../components/PageInfoBar.vue'
import VueLoadImage from 'vue-load-image'
import LoadSpinner from '../components/LoadSpinner.vue'
import ConditionUserList from '../components/ConditionUserList.vue'

export default {
  name: 'ProfilePage',
  components: { PageInfoBar, VueLoadImage, LoadSpinner, ConditionUserList },
  data() {
    return {
      userIdList: [],
    }
  },
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
    },
    isListActivated() {
      return this.$store.state.isConditionUserListActivated
    },
  },
  methods: {
    async toggleFollow() {
      if (!this.isFollowed) {
        const newFollowship = await this.$axios.post(
          `${this.$store.state.API_URL}/users/follow`,
          {
            followerId: this.$store.getters.loginedUserId,
            followedId: this.showingUserData.id
          }
        )
        this.$store.commit('userAbout/UPDATE_FOLLOWSHIP', newFollowship.data)
      } else {
        const followshipToRemove = this.showingUserData.followed.find(e => e.followerId === this.$store.getters.loginedUserId)
        await this.$axios.delete(`${this.$store.state.API_URL}/users/follow/${followshipToRemove.id}`)
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
    },
    showUserList(listType) {
      let userIdList
      if (listType === 'following') {
        userIdList = this.showingUserData.follow.map(e => e.followedId)
      } else {
        userIdList = this.showingUserData.followed.map(e => e.followerId)
      }
      this.userIdList = userIdList
      this.$store.state.isConditionUserListActivated = true
    }
  },
  beforeRouteLeave(to, __from, next) {
    if (!to.path.includes('detail')) {
      this.$store.state.lastUserDetail = ''
    } else {
      this.$store.state.lastUserDetail = this.showingUserData.id
    }
    next()
  },
  async created() {
    const userId =
        this.$route.params.userId ||
        this.$store.state.lastUserDetail ||
        this.$store.getters.loginedUserId

    await this.$store.dispatch('postAbout/getUserPosts', userId)
    await this.$store.dispatch('userAbout/getUser', userId)
  },
  destroyed() {
    this.$store.state.userAbout.otherUserData = {}
  }
}
</script>

<style lang="scss" scoped>


.profile-page {
  height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;

  @include respond($bp-tablet) {
    margin-top: 1rem;
    .page-info {
      display: none;
    }
  }

  @include respond($bp-mobile) {
    height: calc(100vh - 7rem);
  }
}

.post-list {
  overflow-y: auto;
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

.profile-nav {
  display: flex;
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

  @media (hover: hover) {
    &:hover {
      overflow-y: unset;
      p {
        display: block;
        overflow: unset;
        box-shadow: 1rem 1rem 2rem 0 #2278a0;
        background-color: $color-gray-100;
      }
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
      color: $color-gray-900;

      @include respond($bp-mobile) {
        display: block;
      }
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

b {
  color: $color-primary;
  padding: 0 1rem;
  text-decoration: underline;
  text-underline-offset: .5rem;
  cursor: pointer;
}

.active {
  color: $color-brand;
  border-bottom: 2px solid $color-brand;
}
</style>
