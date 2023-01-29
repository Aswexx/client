<template>
  <div class="email-vertification">
    <img class="brand-logo" src="./../assets/images/logo.svg" />
    <h3>Email 驗證</h3>

    <label for="emailVerify">請輸入註冊信箱 <b><em>{{ $route.params.email }}</em></b> 所收到的驗證碼</label>
    <input
      id="emailVerify"
      v-model="emailVertifyCode"
    />
    <button @click="emailVertify">送出</button>
    <router-link to="/register">上一步</router-link>
  </div>
</template>

<script>
export default {
  data(){
    return {
      emailVertifyCode: '',
    }
  },
  methods: {
    async emailVertify(){
      try {
        await this.$axios.post(`${this.$store.state.API_URL}/users/emailVertification`, { vertifyCode: this.emailVertifyCode })

        this.$store.commit('TRIGGER_TOAST', {
          type: 'success',
          detail: '驗證成功，5秒後導向登入頁，請使用新註冊的帳號密碼登入'
        })

        setTimeout(()=> {
          this.$router.push({ name: 'login' })
        }, 5000)

      } catch (err) {
        this.$store.commit('TRIGGER_TOAST', {
          type: 'error',
          detail: '驗證失敗，請回上一步重新註冊嘗試'
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

.email-vertification {
  margin: 6rem auto auto auto;
  width: 36rem;
  height: 25rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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

</style>