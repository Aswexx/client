<template>
  <div class="register">
    <img class="brand-logo" src="./../assets/images/logo.svg">
    <h3>建立你的帳號</h3>

    <form
      id="register"
      :action="`${$store.state.API_URL}/users`"
      ref="register"
      method="post"
    >
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        placeholder="請輸入註冊Email"
        v-model="email"
        ref="emailInput"
      />
      <label for="password" class="password"
        >密碼
        <span class="eye-wrapper">
          <svg class="eye" v-if="visible" @click="toggleVisible">
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-eye"></use>
          </svg>
          <svg class="eye" v-else @click="toggleVisible">
            <use
              xlink:href="./../assets/images/symbol-defs.svg#icon-eye-blocked"
            ></use>
          </svg>
        </span>
      </label>
      <input
        id="password"
        name="password"
        placeholder="請設定8至16位密碼"
        minlength="8"
        maxlength="16"
        :type="visible ? 'text' : 'password'"
      />
      <label for="password-check">確認密碼</label>
      <input
        id="password-check"
        name="passwordCheck"
        placeholder="請再次確認密碼"
        minlength="8"
        maxlength="16"
        :type="visible ? 'text' : 'password'"
      />
      <label for="name">名稱</label>
      <input
        id="name"
        type="text"
        name="name"
        placeholder="請設定顯示在平台上的名稱"
      />
      <label for="alias">別名</label>
      <input
        id="alias"
        type="text"
        name="alias"
        placeholder="請設定顯示在平台上的別名"
      />
    </form>
    <button @click.prevent="validateAndSubmit" form="register">註冊</button>
    <router-link to="/login">取消</router-link>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      visible: false,
      email: ''
    }
  },
  watch: {
    email() {
      if (/@gmail/.test(this.email)) {
        this.email = ''
        this.$store.commit('TRIGGER_TOAST', {
          type: 'info',
          detail: '請使用 Google 帳號綁定註冊'
        })
      }
    }
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible
    },
    async validateAndSubmit() {
      const hasSpace = / /
      const allowedEmailFormat =
        /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+\.com/
      const formData = new FormData(this.$refs.register)

      if (!allowedEmailFormat.test(formData.get('email'))) {
        this.$refs.emailInput.select()
        return this.$store.commit('TRIGGER_TOAST', {
          type: 'info',
          detail: 'email 格式不正確'
        })
      }

      for (const value of formData.values()) {
        if (hasSpace.test(value) || !value.length) {
          return this.$store.commit('TRIGGER_TOAST', {
            type: 'info',
            detail: '不能有空白'
          })
        }
      }

      if (formData.get('name').length > 20 || formData.get('alias').length > 20) {
        return this.$store.commit('TRIGGER_TOAST', {
          type: 'error',
          detail: '名稱或別名最多 20 個字元'
        })
      }

      if (formData.get('password') !== formData.get('passwordCheck')) {
        return this.$store.commit('TRIGGER_TOAST', {
          type: 'info',
          detail: '密碼不一致，請重新確認'
        })
      }

      try {
        await this.$axios.post(`${this.$store.state.API_URL}/users`, formData)
      } catch (err) {
        return this.$store.commit('TRIGGER_TOAST', {
          type: 'info',
          detail: err.response.data
        })
      }

      // * wait for email vertification
      this.$router.push({ name: 'email-vertification' , params: { email: formData.get('email')}})
    }
  }
}
</script>

<style lang="scss" scoped>
.brand-logo {
  width: 10rem;
  height: 7.5rem;
}

.register {
  margin: 6rem auto auto auto;
  width: 36rem;
  height: 60rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.eye-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  margin-left: 1rem;
}

svg {
  width: 5rem;
  height: 5rem;

  &.eye {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
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
  padding: 0.7rem;
  width: 50%;
  margin-left: auto;
  text-align: end;

  span {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

button {
  margin-top: -1rem;
}

.password {
  position: relative;
}

.toast-container {
  position: absolute;
  top: 30;
  right: 0;
  overflow: hidden;
}
</style>
