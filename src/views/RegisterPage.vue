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
      <!-- <label for="email">Email</label>
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
      /> -->
      <!-- <label for="password-check">確認密碼</label>
      <input
        id="password-check"
        name="passwordCheck"
        placeholder="請再次確認密碼"
        minlength="8"
        maxlength="16"
        :type="visible ? 'text' : 'password'"
      /> -->
      <!-- <label for="name">名稱</label>
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
      /> -->
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
      
      <HollowInput labelName="Email" forAttr="email">
        <input
          id="email"
          type="email"
          name="email"
          placeholder="請輸入註冊Email"
          v-model="email"
          ref="emailInput"
        />
      </HollowInput>

      <HollowInput labelName="密碼" forAttr="password">
        <input
          id="password"
          name="password"
          placeholder="請設定8至16位密碼"
          minlength="8"
          maxlength="16"
          :type="visible ? 'text' : 'password'"
        />
      </HollowInput>

      <HollowInput labelName="確認密碼" forAttr="password-check">
        <input
          id="password-check"
          name="passwordCheck"
          placeholder="請再次確認密碼"
          minlength="8"
          maxlength="16"
          :type="visible ? 'text' : 'password'"
        />
      </HollowInput>

      <HollowInput labelName="名稱" forAttr="name">
        <input
          id="name"
          type="text"
          name="name"
          placeholder="請設定顯示在平台上的名稱"
        />
      </HollowInput>

      <HollowInput labelName="別名" forAttr="alias">
        <input
          id="alias"
          type="text"
          name="alias"
          placeholder="請設定顯示在平台上的別名"
        />
      </HollowInput>
    </form>
    <div class="control">
      <button @click.prevent="validateAndSubmit" form="register">註冊</button>
      <router-link to="/login">取消</router-link>
    </div>
  </div>
</template>

<script>
import HollowInput from '@/components/HollowInput.vue'
export default {
  name: 'RegisterPage',
  components: { HollowInput },
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
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 30rem;

  .eye-wrapper {
    position: absolute;
    top: 7.25rem;
    right: 1rem;
    margin-left: 1rem;
    z-index: 3;
  }
}

button {
  width: 100%;
  background: linear-gradient(45deg, $color-brand-deep, $color-brand);
  transition: all .2s ease-in-out;

  &:hover {
    transform: scaleX(1.05) scaleY(1.1);
  }
}

a {
  display: inline-block;
  width: 100%;
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

.control {
  width: 100%;
  button {
    margin-bottom: 1rem;
  }
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
