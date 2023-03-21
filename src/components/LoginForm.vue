<template>
  <div class="user-login">
    <!-- <img class="brand-logo" src="@/assets/images/logo.svg"> -->
    <img class="brand-logo" src="@/assets/images/logo-light-theme.png">
    <h3 v-if="currentPage === 'login'">歡迎使用 Posquare</h3>

    <h3 v-else-if="currentPage === 'admin-login'">後台登入</h3>

    <form>
      <HollowInput forAttr="account" :labelName="accountTypeLabelName">
        <input
          id="account"
          name="account"
          type="account"
          v-model="account"
        />
      </HollowInput>

      <HollowInput labelName="密碼" forAttr="password">
        <input
          id="password"
          name="password"
          type="password"
          v-model="password"
        />
      </HollowInput>

    </form>
    <div class="other" :class="{ 'cms-login': $route.name === 'admin-login' }">
      <button @click="login">登入</button>
      <GoogleSignInButton v-if="currentPage === 'login'"></GoogleSignInButton>

      <div class="non-login">
        <router-link class="non-login-option" v-show="currentPage === 'login'" to="/register"
          >註冊</router-link
        >
        <!-- <span v-if="currentPage === 'login'">·</span> -->
        <router-link class="non-login-option" v-if="currentPage === 'login'" to="/admin-login"
          >後台登入</router-link
        >
        <router-link class="non-login-option" v-else to="/login">前台登入</router-link>
      </div>

    </div>

    <ThemeSwitcher/>

  </div>
</template>

<script>
import GoogleSignInButton from './GoogleSignInButton.vue'
import HollowInput from './HollowInput.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
export default {
  data() {
    return {
      currentPage: this.$route.name,
      account: '',
      password: ''
    }
  },
  computed: {
    accountTypeLabelName() {
      return this.$route.name ==='login' ? '登入Email': '管理者帳號'
    },
  },
  components: { GoogleSignInButton, HollowInput, ThemeSwitcher },
  methods: {
    async login() {
      const loginInfo = {
        account: this.account,
        password: this.password,
        isIOSdevice: this.$store.state.isIOSdevice
      }

      try {
        if (!loginInfo.account ||
            !loginInfo.password ||
            !/@/.exec(loginInfo.account)) {
          throw new Error
        }

        if (this.currentPage === 'login') {
          await this.$store.dispatch('userAbout/auth', loginInfo)
          // await this.$store.dispatch('userAbout/getUsers')
          this.$router.push({ name: 'home' })
          return
        }

        await this.$store.dispatch('userAbout/authAdmin', loginInfo)
        await this.$store.dispatch('postAbout/getAdminPagePosts')
        this.$router.push({ name: 'post-list' })
      } catch (err) {
        this.$store.commit('TRIGGER_TOAST', {
          type: 'error',
          detail: '輸入格式不正確或資料有誤'
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.brand-logo {
  width: 10rem;
  height: 7.5rem;
}

.user-login {
  margin: 6rem auto auto auto;
  width: 36rem;
  height: 45rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

svg {
  width: 5rem;
  height: 5rem;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 11rem;
}


.other {
  width: 100%;
  height: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;


  button {
    position: relative;
    width: 100%;
    background: linear-gradient(45deg, $color-brand-deep, $color-brand);
    transition: all .2s ease-in-out;

    &:hover {
      transform: scaleX(1.05) scaleY(1.1);
    }
  }
}

  .non-login {
    width: 100%;

    a {
      display: inline-block;
      width: 50%;
      text-decoration: none;
      text-align: center;
      padding: .8rem 0;
      border: 1px solid #dadce0;
      border-radius: 2rem;
      font-size: 1.4rem;
      color: $color-gray-800;

      &:hover {
        background-color: #F8FAFF;
      }
    }
  }


.other.cms-login {
  height: 7rem;
  a {
    width: 100%;
  }
}

button {
  margin-top: -1rem;
}

button:active {
  color: blue;
}

</style>