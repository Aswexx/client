<template>
  <div class="user-login">
    <img class="brand-logo" src="./../assets/images/logo.svg">
    <h3 v-if="currentPage === 'login'">登入 Posquare</h3>

    <h3 v-else-if="currentPage === 'admin-login'">後台登入</h3>

    <form action="">
      <label for="account">登入Email</label>
      <input
        id="account"
        name="account"
        type="email"
        placeholder="請輸入Email"
        v-model="account"
      />
      <label for="password">密碼</label>
      <input
        id="password"
        name="password"
        type="password"
        placeholder="請輸入密碼"
        v-model="password"
      />
    </form>
    <button @click="login">登入</button>
    <div class="other">
      <GoogleSignInButton v-if="currentPage === 'login'"></GoogleSignInButton>
      <router-link v-show="currentPage === 'login'" to="/register"
        >註冊</router-link
      >

      <span v-if="currentPage === 'login'">·</span>
      <router-link v-if="currentPage === 'login'" to="/admin-login"
        >後台登入</router-link
      >

      <router-link v-else to="/login">前台登入</router-link>
    </div>
  </div>
</template>

<script>
import GoogleSignInButton from './GoogleSignInButton.vue'
export default {
  data() {
    return {
      currentPage: this.$route.name,
      account: '',
      password: ''
    }
  },
  components: { GoogleSignInButton },
  methods: {
    async login() {
      const loginInfo = {
        account: this.account,
        password: this.password
      }
      try {
        if (!loginInfo.account || 
            !loginInfo.password ||
            !/@/.exec(loginInfo.account)) {
          throw new Error
        }

        if (this.currentPage === 'login') {
          await this.$store.dispatch('userAbout/auth', loginInfo)
          // await this.$store.dispatch('userAbout/getPopUsers')
          await this.$store.dispatch('userAbout/getUsers')
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
    }
  }
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
  height: 42rem;

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
  width: 100%;

  & > * {
    background-color: $color-gray-200;
    padding-left: 1rem;
  }
}

label {
  padding-bottom: 0.7rem;
  font-size: 1.4rem;
}

input {
  border: none;
  outline: none;
  border-bottom: 1px solid $color-gray-800;
  padding-bottom: 0.3rem;
  margin-bottom: 2rem;
  font-size: 1.6rem;
}

.other {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .google-icon {
    width: 3rem;
    height: 3rem;
    margin-right: auto;
    cursor: pointer;
  }

  span {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

button {
  margin-top: -1rem;
}

button:active {
  color: blue;
}

</style>