<template>
  <div class="setting-page">
    <PageInfoBar />

    <img
      class="user-bg"
      :src="$store.getters.loginedUser.bgImageUrl"
      ref="backgroundImage"
      @click="showImagePicker"
      @error="setAltImg"
    />
    <img
      class="user-avatar"
      :src="$store.getters.loginedUser.avatarUrl"
      @click="showImagePicker"
      @error="setAltImg"
      ref="avatar"
    />
    <h5>{{ profile.name }}</h5>
    <span>@{{ profile.alias }}</span>
    <p>{{ profile.bio }}</p>

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
        hidden
        @change="showSelectedFile"
      />
      <input
        type="file"
        accept="image/png, image/jpeg"
        name="avatarImage"
        ref="avatarInput"
        hidden
        @change="showSelectedFile"
      />

      <InputItem
        :inputInfo="{
          inputTagId: 'alias',
          inputTagName: 'alias',
          type: 'text',
          labelName: '別名',
          originData: profile.alias,
          editable: true,
          placeholder: '',
        }"
      />

      <InputItem
        :inputInfo="{
          inputTagId: 'bio',
          inputTagName: 'bio',
          type: 'text',
          labelName: '個人簡介',
          originData: profile.bio,
          editable: true,
          placeholder: '',
        }"
      />

      <button @click.prevent="validateThenSubmit" form="setting">儲存</button>
    </form>
  </div>
</template>

<script>
import PageInfoBar from "../components/PageInfoBar.vue";
import InputItem from "../components/InputItem.vue";
export default {
  name: "SettingPage",
  data() {
    return {
      allowedExtensions: /(\.jpeg|\.png)$/i,
      currentData: "",
      bgToUpdate: "",
      avatarToUpdate: "",
    };
  },
  computed: {
    profile() {
      return this.$store.getters.loginedUser;
    },
    isDataChanged() {
      const form = this.$refs.settingForm;
      const formData = new FormData(form);
      if (
        formData.get("alias") === this.currentData.alias &&
        formData.get("bio") === this.currentData.bio
      ) {
        return false;
      }

      return true;
    },
  },
  components: { PageInfoBar, InputItem },
  methods: {
    showImagePicker(event) {
      if (event.target.className === "user-bg")
        return this.$refs.backgroundInput.click();
      this.$refs.avatarInput.click();
    },
    setAltImg(event) {
      if (event.target.className === "user-bg") {
        event.target.src = require("@/assets/images/default-profile-bg.jpg");
        return;
      }

      event.target.src = require("@/assets/images/default_avatar1.png");
    },
    showSelectedFile(event) {
      const fileList = event.target.files;
      const fileURL = URL.createObjectURL(fileList[0]);
      if (event.target.name === "backgroundImage") {
        this.bgToUpdate = fileURL;
        return (this.$refs.backgroundImage.src = fileURL);
      }
      this.avatarToUpdate = fileURL;
      this.$refs.avatar.src = fileURL;
    },
    validateThenSubmit() {
      const form = this.$refs.settingForm;
      const formData = new FormData(form);

      if (
        formData.get("alias") === this.currentData.alias &&
        formData.get("bio") === this.currentData.bio &&
        !this.bgToUpdate &&
        !this.avatarToUpdate
      )
        return this.$store.commit("TRIGGER_TOAST", {
          type: "error",
          detail: "請更新個人資訊、頭像或背景圖再嘗試",
        });

      if (
        formData.get("alias").length === 0 ||
        formData.get("alias").length > 20 ||
        formData.get("bio").length === 0 ||
        formData.get("bio").length > 100
      ) {
        return this.$store.commit("TRIGGER_TOAST", {
          type: "error",
          detail: "輸入內容不能為空，別名不能超過 20 個字，簡介不能超過 100 個字",
        });
      }

      this.$store.dispatch("userAbout/updateProfile", formData);
    },
  },
  mounted() {
    this.currentData = {
      alias: this.$store.getters.loginedUser.alias,
      bio: this.$store.getters.loginedUser.bio,
    };
  },
};
</script>

<style lang="scss" scoped>
.input-groups {
  margin-top: 1.5rem;
}

img {
  cursor: pointer;
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
