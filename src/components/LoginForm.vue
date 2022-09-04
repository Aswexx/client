<template>
  <div class="user-login">
    <svg class="brand-logo">
      <use
        xlink:href="./../assets/images/symbol-defs.svg#icon-brand-logo"
      ></use>
    </svg>
    <h3 v-if="currentPage === 'login'">登入 Alphitter</h3>

    <h3 v-else-if="currentPage === 'admin-login'">後台登入</h3>

    <form action="">
      <label for="account">登入Email</label>
      <input
        id="account"
        name="account"
        type="email"
        placeholder="請輸入登入Email"
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
    <a href="http://localhost:4000/auth/google">Google 登入</a>
    <div class="other">
      <GoogleSignInButton></GoogleSignInButton>
      <router-link v-show="currentPage === 'login'" to="/register"
        >註冊</router-link
      >

      <span>·</span>
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
        await this.$store.dispatch('userAbout/auth', loginInfo)
        await this.$store.dispatch('userAbout/getPopUsers')
        await this.$store.dispatch('postAbout/getHomePagePosts')
        this.$router.push({ name: 'home' })
      } catch (err) {
        alert(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/abstracts.scss';

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
</style>