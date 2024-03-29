<template>
  <div class="nav">
    <img class="brand-logo" src="./../assets/images/logo.svg" />
    <ul>
      <li>
        <router-link :to="isAdmin ? '/post-list' : '/home'" active-class="active">
          <svg>
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-home"></use>
          </svg>
          <span>{{ isAdmin ? '貼文列表' : '首頁' }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          :to="isAdmin ? '/user-list' : '/profile/posts'" active-class="active"
        >
          <svg>
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-user"></use>
          </svg>
          <span>{{ isAdmin ? '使用者列表' : '個人詳情' }}</span>
        </router-link>
      </li>

      <li v-if="isAdmin">
        <router-link to="/stats" active-class="active">
          <svg>
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-stats"></use>
          </svg><span>統計</span>
        </router-link>
      </li>

      <li v-if="!isAdmin">
        <router-link to="/notifications" active-class="active" class="unread">
          <span v-if="unreadCounts" class="unread-dot">
            {{ unreadCounts }}
          </span>
          <svg>
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-notifications"></use>
          </svg>
          <span>通知</span>
        </router-link>
      </li>

      <li v-if="!isAdmin && this.$store.state.viewport >= 576">
        <router-link to="/setting" active-class="active">
          <svg>
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-setting"></use>
          </svg><span>設定</span>
        </router-link>
      </li>

      <li v-if="!isAdmin && this.$store.state.viewport < 576">
        <router-link to="/followship" active-class="active">
          <svg>
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-search"></use>
          </svg>
        </router-link>
      </li>

      <li v-if="!isAdmin">
        <router-link to="/sponsor" active-class="active">
          <svg>
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-medal"></use>
          </svg>
          <span>帳號升級</span>
        </router-link>
      </li>

      <button @click="triggerChat">
        <svg class="chat-icon" :class="{ active: $store.state.isChatActivated }">
          <use xlink:href="../assets/images/symbol-defs.svg#icon-chat"></use>
        </svg>
      </button>

      <li v-if="!isAdmin && this.$store.state.viewport < 576" @click="logout">
        <a>
          <svg class="">
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-logout"></use>
          </svg>
          <span>登出</span>
        </a>
      </li>

      <button v-if="!isAdmin && $store.state.viewport >= 576" @click="post">
        <span>貼文</span>
        <svg class="post-icon" :class="{ active: $store.state.isModalOpened }" v-if="matchTablet">
          <use xlink:href="./../assets/images/symbol-defs.svg#post-icon"></use>
        </svg>
      </button>
    </ul>

    <div class="logout" @click="logout">
      <svg class="">
        <use xlink:href="./../assets/images/symbol-defs.svg#icon-logout"></use>
      </svg>
      <span>登出</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      matchTablet: window.matchMedia('(max-width: 768px)').matches,
      isAdmin: this.$store.state.userAbout.userRole === 'admin'
    }
  },
  computed: {
    unreadCounts() {
      return this.$store.getters.unreadNotifs
    },
  },
  methods: {
    post() {
      this.$store.commit('TOGGLE_MODAL')
    },
    triggerChat() {
      if (!this.$store.state.chatTargetList.length && !this.$store.state.isChatActivated) {
        return this.$store.commit('TRIGGER_TOAST', {
          type: 'info',
          detail: '沒有已開啟的聊天'
        })
      }

      if (!this.$store.state.isChatActivated) {
        this.$store.commit('TRIGGER_CHAT')
      } else {
        this.$store.commit('MINIMIZE_CHAT_SECTION')
      }
    },
    async logout() {
      await this.$axios.get(`${this.$store.state.API_URL}/users/logout`)
      if (this.isAdmin) {
        this.$router.push({ name: 'admin-login' })
      } else {
        this.$router.push({ name: 'login' })
      }
      sessionStorage.clear()
      this.$store.state.userAbout.loginedUserData = {}
      this.$store.state.notifications = []
      window.location.reload()
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.matchTablet = window.matchMedia('(max-width: 768px)').matches
      this.$store.commit('CHANGE_VIEWPORT', window.innerWidth)
    })
  }
}
</script>

<style lang="scss" scoped>
.active {
  color: $color-brand;
  fill: $color-brand;

  transition: all 0.3s ease-in;
}

div.nav {

  display: flex;
  flex-direction: column;
  align-items: center;

  .brand-logo {
    width: 8rem;
    height: 8rem;
  }

  @include respond($bp-tablet) {
    .brand-logo {
      align-self: center;
    }
  }

  @include respond($bp-mobile) {
    height: 5.5rem;

    .brand-logo,
    .logout {
      display: none;
    }

    border-top: 1px solid $color-gray-200;
    background-color: $color-gray-400;

    position: fixed;
    z-index: 999;
    width: 100%;
    bottom: 0;
  }
}

ul {
  height: 100%;
  max-height: 28rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @include respond($bp-tablet) {
    align-items: center;
  }

  @include respond($bp-mobile) {
    flex-direction: row;
    width: 100%;
  }
}

.logout {
  margin-top: auto;
  cursor: pointer;
}

li>a,
.logout {
  display: flex;
  align-items: center;
}

a {
  text-decoration: none;
  color: $color-gray-900;
}

svg {
  width: 2.4rem;
  height: 2.4rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;

  &.brand-logo {
    width: 5rem;
    height: 5rem;
  }

  &.post-icon {
    fill: $color-gray-100;
  }

  &.chat-icon {
    width: 2rem;
    height: 2rem;
    stroke: $color-gray-100;
    stroke-width: 1.5;
  }

}


.unread {
  position: relative;

  &-dot {
    position: absolute;
    top: 0;
    right: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 2rem;
    border-radius: 5px;
    background-color: red;
    color: $color-gray-200;
    font-size: 0.1rem;
  }
}


@include respond($bp-tablet) {
  span {
    display: none;
  }

  button {
    width: 4rem;
    height: 4rem;
    padding: 0;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg.post-icon {
    margin: 0;
    fill: $color-gray-100;
  }
}

@include respond($bp-mobile) {
  button {
    background-color: $color-gray-400;
  }

  svg.chat-icon {
    stroke: $color-gray-900;
    scale: 2.5;
  }

  svg.chat-icon.active {
    stroke: $color-brand;
  }

  svg.post-icon {
    fill: $color-gray-900;
  }

  svg.post-icon.active {
    fill: $color-brand;
  }

  .unread-dot {
    width: 1.5rem;
    height: 1.5rem;
    top: -.75rem;
    right: 1rem;
    background-color: red;
  }
}
</style>
