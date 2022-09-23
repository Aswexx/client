<template>
  <div class="setting-page">
    <PageInfoBar />

    <img
      class="user-bg"
      :src="$store.getters.loginedUser.bgImageUrl"
      @click="showFilePicker('image/png, image/jpeg')"
    />
    <img class="user-avatar" :src="$store.getters.loginedUser.avatarUrl" />
    <p>{{ bio }}</p>

    <!-- action="`${$store.state.API_URL}/users/${$store.state.getters.loginedUserId}`" -->
    <form
      method="post"
      enctype="multipart/form-data"
      id="setting"
      class="input-groups"
      @submit.prevent="saveSetting"
      ref="settingForm"
    >
      <input
        type="file"
        accept="image/png, image/jpeg"
        name="backgroundImage"
        ref="backgroundInput"
      />
      <input type="file" accept="image/png, image/jpeg" name="avatarImage" />

      <!-- <InputItem :inputInfo="{
        inputTagId:'account',
        inputTagName:'account',
        type:'text',
        labelName:'帳號',
        originData: 'holahola',
        editable: false,
        placeholder: ''
      }"/> -->

      <InputItem
        :inputInfo="{
          inputTagId: 'alias',
          inputTagName: 'alias',
          type: 'text',
          labelName: '別名',
          originData: alias,
          editable: true,
          placeholder: ''
        }"
      />

      <InputItem
        :inputInfo="{
          inputTagId: 'bio',
          inputTagName: 'bio',
          type: 'text',
          labelName: '個人簡介',
          originData: bio,
          editable: true,
          placeholder: ''
        }"
      />

      <InputItem
        :inputInfo="{
          inputTagId: 'password',
          inputTagName: 'password',
          type: 'password',
          labelName: '密碼',
          originData: '',
          editable: true,
          placeholder: '請設定密碼'
        }"
      />

      <InputItem
        :inputInfo="{
          inputTagId: 'checkPassword',
          inputTagName: 'checkPassword',
          type: 'password',
          labelName: '密碼再確認',
          originData: '',
          editable: true,
          placeholder: '請再次設定密碼'
        }"
      />

      <button
        @click.prevent="validateThenSubmit"
        form="setting"
        :disabled="!isPasswordSame"
      >
        儲存
      </button>
    </form>
  </div>
</template>

<script>
import PageInfoBar from '../components/PageInfoBar.vue'
import InputItem from '../components/InputItem.vue'
export default {
  data() {
    return {
      isPasswordSame: true,
      allowedExtensions: /(\.jpeg|\.png)$/i,
      alias: this.$store.getters.loginedUser.alias,
      bio: this.$store.getters.loginedUser.bio
    }
  },
  components: { PageInfoBar, InputItem },
  methods: {
    saveSetting(event) {
      // ! 先確認密碼一致
      // ! 補提交密碼變更
      console.log(event.target)
      const form = event.target
      const formData = new FormData(form)
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:${value}`)
      }
      if (formData.get('password') !== formData.get('checkPassword')) {
        console.log(formData.get('password'))
        return alert('請再次確認密碼!')
      }

      form.submit()
    },
    showFilePicker() {
      alert('hi')
      this.$refs.backgroundInput.click()
    },
    validateThenSubmit() {
      alert('start validation')
      const form = this.$refs.settingForm
      const formData = new FormData(form)
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:${value}`)
      }

      this.$store.dispatch('userAbout/updateProfile', formData)

      // this.$refs.settingForm.submit()
    }
  }
}
</script>

<style lang="scss" scoped>
.input-groups {
  margin-top: 1.5rem;
}

.user-bg {
  display: block;
  border-radius: 0;
  width: 100%;
  height: 20rem;

  object-fit: cover;
  object-position: 0 80%;
}

.user-avatar {
  display: block;
  width: 14rem;
  height: 14rem;
  transform: translate(1.5rem, -8.6rem);
  border: 5px solid $color-gray-100;
}

button {
  width: 9rem;
  margin-left: auto;
  display: block;
}
</style>