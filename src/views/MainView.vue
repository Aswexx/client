<template>
  <div class="main-view">

    <NavBar/>
    <router-view></router-view>
    <PopUserList/>

    <!-- post modal -->
    <div class="post-modal"
      v-show="showingModal === 'post'"
    >

      <div class="post-input-group" @click="focusInput()">
        <p>
          <svg @click="closeModal()"><use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use></svg>
        </p>
        <img src="./../assets/images/default-avatar.jpg" alt="avatar" class="avatar">
        <textarea placeholder="有什麼新鮮事?"
          v-model="postContent"
          ref="txtarea"
        ></textarea>
        <div class="button-group">
          <span>
            {{validationErrMsg}}
          </span>
          <button 
            @click="submitPost()"
            :disabled="postContent.length === 0 || postContent.length > 140"
          >推文</button>
        </div>
      </div>

    </div>

    <!-- reply modal -->
    <div class="post-modal"
      v-show="showingModal === 'reply'"
    >
      <div class="post-input-group" 
        @click="focusInput()"
        :class="{reply: showingModal === 'reply'}"
      >
        <p>
          <svg @click="closeModal()"><use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use></svg>
        </p>

        <div class="source-post">
          <img src="./../assets/images/default-avatar2.jpg" alt="avatar">
          <div class="interact">
            <span>Apple</span>
            <span>@Mango ‧ 3小時</span>
          </div>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates harum repellat tempora dignissimos sit, perferendis amet soluta consectetur aut sed!</p>
          <p>回覆給<span>@apple</span></p>
        </div>

        <img src="./../assets/images/default-avatar.jpg" alt="avatar" class="avatar">
        <textarea placeholder="推你的回覆"
          v-model="replyContent"
          ref="txtarea"
        ></textarea>
        <div class="button-group">
          <span>
            {{validationReplyErrMsg}}
          </span>
          <button 
            @click="submitReply()"
            :disabled="replyContent.length === 0 || replyContent.length > 140"
          >回覆</button>
        </div>
      </div>

    </div>

    <!-- profile modal -->
    <div class="post-modal"
      v-show="showingModal === 'editProfile'"
    >
      <div class="profile-card">
        <div class="title">
          <span>
            <svg @click="closeModal()"><use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use></svg>
          </span>
          <span class="title-text">編輯個人資料</span>
          <span class="validation-error"
            v-show="editNameContent.length > 20 || editIntroContent.length > 160"
          >
            編輯字數不符限制
          </span>
          <button 
            :disabled="editNameContent.length > 20 || editIntroContent.length > 160"
            @click="saveProfile"
          >
          儲存</button>
        </div>

        <div class="bg-wraper">
          <svg>
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-camera"></use>
          </svg>
          <svg>
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use>
          </svg>
        </div>

        <div class="avatar-wraper">
          <svg>
            <use xlink:href="./../assets/images/symbol-defs.svg#icon-camera"></use>
          </svg>
        </div>

        <div class="profile-input-group">
          <label for="profile-name">名稱</label>
          <input type="text" name="" id="profile-name"
            v-model="editNameContent"
          >
          <span>{{ editNameContent.length }}/20</span>
          <label for="profile-intro">自我介紹</label>
          <textarea name="" id="profile-intro"
            v-model="editIntroContent"
          ></textarea>
          <span>{{ editIntroContent.length }}/160</span>
        </div>

      </div>
    
    </div>

  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import PopUserList from '../components/PopUserList.vue'

export default {
  name: 'MainView',
  data(){
    return {
      postList: [],
      postContent:'',
      validationErrMsg: '內容不可為空',
      replyContent:'',
      validationReplyErrMsg: '內容不可為空',
      showingModal: '',
      editNameContent: '',
      editIntroContent: '',
    }
  },
  watch: {
    postContent(newVal){
      if (newVal.length === 0){
        this.validationErrMsg = '內容不可為空'
      } else if (newVal.length > 10) {
        this.validationErrMsg = '字數不可超過 140 字'
      } else {
        this.validationErrMsg = ''
      }
    },
    replyContent(newVal){
      if (newVal.length === 0){
        this.validationReplyErrMsg = '內容不可為空'
      } else if (newVal.length > 140) {
        this.validationReplyErrMsg = '字數不可超過 140 字'
      } else {
        this.validationReplyErrMsg = ''
      }
    }
  },
  methods: {
    showModal(modalType){
      this.showingModal = modalType
    },
    closeModal(){
      this.showingModal = ''
    },
    submitPost(){
      //! 補提交推文
      this.closeModal()
    },
    focusInput(){
      this.$refs.txtarea.focus()
    },
    showReplyModal(){
      this.isReplying = true
    },
    submitReply(){
      //! 補提交回復
      this.closeReplyModal()
    },
    saveProfile(){
      // ! 補更新使用者個人資訊
      alert('2222')
    }
  },
  components: {NavBar,PopUserList},
  mounted(){
    this.$bus.$on('activatePost',this.showModal)
    this.$bus.$on('activateReply',this.showModal)
    this.$bus.$on('activateEditProfile',this.showModal)
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

.main-view {
  max-width: 1140px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 16% 60% 24%;

  div {
    padding: 0 .8rem;
  }

  @include respond($bp-tablet) {
    grid-template-columns: 10% 55% 35%;
  }

  @include respond($bp-mobile) {
    grid-template-columns: 100%;
  }
}

.post-modal {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba($color: $color-gray-700, $alpha: .5);
}

.post-input-group, .profile-card {
  width: 50%;
  height: 30rem;
  margin: 5rem auto auto auto;

  background-color: $color-gray-100;
  border: 1px solid $color-gray-400;
  border-radius: 15px;

  svg {
    width: 1.2rem;
    height: 1.2rem;
    fill: $color-brand;
    cursor: pointer;
  }

  p {
    border-bottom: 1px solid $color-gray-500;
    padding: 1rem;
  }

  img {
    margin-top: 1.5rem;
    margin-left: 1rem;
  }
}

.button-group {
  margin-top: 13rem;
  margin-right: 1.5rem;

  text-align: end;
  button {
    width: 7.5rem;
    padding: 1rem 1.25rem;
    margin-left: 1rem;
  }

  span {
    color: $color-brand;
  }
}


textarea {
  font-size: 1.8rem;
  width: 70%;
  color: $color-gray-500;
  font-weight: bold;
  resize: none;
  overflow-y: hidden;
  padding-left: 1rem;
  border: none;
  outline: none;

  &:focus {
    color: $color-gray-900;
  }
}

.source-post {
  display: grid;
  grid-template-columns: min-content auto;
  grid-column-gap: 1rem;

  margin-top: 1rem;
  position: relative;

  &::after {
    content: "";
    width: .15rem;
    height: calc(100% - 5.5rem);
    background-color: $color-gray-300;
    position: absolute;
    left: 3.25rem;
    top: 6rem;
  }

  img {
    margin-top: 0;
  }

  p {
    padding: 1rem 1rem 1rem 0;
    border-bottom: none;
    &:last-child{
      font-weight: bold;
      color: $color-gray-700;
      grid-column: 2/-1;
    }
    span {
      padding-left: 1rem;
      color: $color-brand;
    }
  }
}

.reply {
  height: 43rem;
}

// profile-edit modal
.profile-card {
  height: 60%;
}

.title {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  font-weight: bold;
  svg {
    margin: 0 2rem;
  }
  button {
    padding: 1rem 1.5rem;
    margin-right: 1rem;
    width: 6.4rem;
  }
  .title-text {
    flex: 1;
  }
}

.bg-wraper {
  margin-top: .5rem;
  background-image: url('./../assets/images/default-profile-bg.jpg');
  background-position: 50% 75%;
  background-size: cover;
  height: 20rem;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    fill: $color-gray-100;
    margin: 0 1rem;
    width: 2.4rem;
    height: 2.4rem;
    transition: fill .2s ease-in;

    &:hover {
      fill: $color-gray-300;
    }
  }
}

.avatar-wraper {
  width: 14rem;
  height: 14rem;
  background-image: url('./../assets/images/default-avatar3.jpg');
  background-size: cover;

  border-radius: 50%;
  border: 5px solid $color-gray-100;
  position: relative;

  transform: translate(1rem ,-50%);

  svg {
    position: absolute;
    top: calc(37.5% + 5px);
    left: calc(37.5% - 5px);
    fill: $color-gray-100;
    margin: 0 1rem;
    width: 2.4rem;
    height: 2.4rem;
    transition: fill .2s ease-in;

    &:hover {
      fill: $color-gray-300;
    }
  }
}

.profile-input-group {
  margin-top: -6rem;
  display: flex;
  flex-direction: column;

  label,input,textarea {
    background-color: $color-gray-200;
  }

  label {
    color: $color-gray-800;
    padding-bottom: .5rem;
  }

  input {
    border: none;
    &:focus {
      outline: none;
    }
  }

  input,textarea {
    border-bottom: 2px solid $color-gray-900;
  }

  textarea {
    width: 100%;
    padding: 0;
    height: 9rem;
  }

  span {
    align-self: flex-end;
  }
}

.validation-error {
  color: $color-error;
  padding-right: 1rem;
}

</style>