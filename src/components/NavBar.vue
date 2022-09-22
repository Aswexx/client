<template>
  <div class="nav">
    <svg class="brand-logo">
      <use
        xlink:href="./../assets/images/symbol-defs.svg#icon-brand-logo"
      ></use>
    </svg>

    <ul :class="{ 'admin-nav': isAdmin }">
      <li>
        <router-link
          :to="isAdmin ? '/post-list' : '/home'"
          active-class="active"
        >
          <svg>
            <use
              xlink:href="./../assets/images/symbol-defs.svg#icon-home"
            ></use>
          </svg>
          <span>{{ isAdmin ? '推文清單' : '首頁' }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="isAdmin ? '/user-list' : '/profile/posts'"
          active-class="active"
        >
          <svg>
            <use
              xlink:href="./../assets/images/symbol-defs.svg#icon-user"
            ></use>
          </svg>
          <span>{{ isAdmin ? '使用者列表' : '個人資料' }}</span>
        </router-link>
      </li>
      <li>
        <router-link to="/notifications" active-class="active" class="unread">
          <span class="unread-dot">{{ unreadCounts }}</span>
          <svg>
            <use
              xlink:href="./../assets/images/symbol-defs.svg#icon-notifications"
            ></use>
          </svg>
          <span>通知</span>
        </router-link>
      </li>
      <li>
        <router-link v-if="!isAdmin" to="/setting" active-class="active">
          <svg>
            <use
              xlink:href="./../assets/images/symbol-defs.svg#icon-setting"
            ></use></svg
          ><span>設定</span>
        </router-link>
      </li>
      <button v-if="!isAdmin" @click="post">
        <span>推文</span>
        <svg class="post-icon" v-if="matchTablet">
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
      isAdmin: this.$store.state.userRole === 'admin'
    }
  },
  computed: {
    unreadCounts() {
      return this.$store.getters.unreadNotifs
    }
  },
  methods: {
    post() {
      this.$store.commit('TOGGLE_MODAL')
    },
    logout() {
      if (this.isAdmin) {
        // TODO 清空驗證
        return this.$router.push({ name: 'admin-login' })
      }
      // this.$io(`${this.$store.state.API_URL}/notification`).disconnect()
      // TODO:清空驗證
      this.$router.push({ name: 'login' })
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
  position: sticky;
  top: 0;
  height: 98vh;

  display: flex;
  flex-direction: column;
  align-items: center;

  .brand-logo {
    align-self: flex-start;
  }

  ul.admin-nav {
    height: 15rem;
    margin-top: 1rem;
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
    background-color: blue;

    position: fixed;
    width: 100%;
    bottom: 0;
  }
}

ul {
  height: 24.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  @include respond($bp-tablet) {
    align-items: center;
  }

  @include respond($bp-mobile) {
    flex-direction: row;
    width: 100%;
    button {
      background-color: white;
    }
  }
}

.logout {
  margin-top: auto;
  cursor: pointer;
}

li > a,
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
  svg.post-icon {
    fill: $color-gray-900;
  }
}
</style>