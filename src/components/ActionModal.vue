<template>
  <transition name="modal-fade">
    <div class="modal" v-show="isActivated">
      <transition name="modal-inner-offset">
        <div class="post-input-group"
          v-show="$store.state.modalType !== 'photo'"
        >
          <div class="post-input-title">
            <svg v-if="$store.state.viewport < 576" @click="closeModal()">
              <use
                xlink:href="../assets/images/symbol-defs.svg#icon-arrow-left2"
              ></use>
            </svg>

            <svg v-else @click="closeModal()">
              <use
                xlink:href="../assets/images/symbol-defs.svg#icon-cross"
              ></use>
            </svg>
          </div>
          <ContentPoster class="content-poster"
            :source="source"
          />
        </div>
      </transition>

      <transition name="modal-inner-offset">
        <div class="photo-taking" v-show="$store.state.modalType === 'photo'">
          <video playsinline ref="video" width="500" height="375"></video>
          <div class="photo-taking__controls">
            <span @click="switchCam"><svg><use xlink:href="../assets/images/symbol-defs.svg#icon-switch"></use></svg></span>
            <span @click="snapShot"><svg><use xlink:href="../assets/images/symbol-defs.svg#icon-concentric-circle"></use></svg></span>
            <span @click="cancelPhotoTaking"><svg><use xlink:href="../assets/images/symbol-defs.svg#icon-cross"></use></svg></span>
          </div>
        </div>
      </transition>
      <canvas class="snapToUpload" ref="canvas"></canvas>
      
      <transition name="modal-inner-offset">
        <div class="profile-card" v-show="modalType === 'editProfile'">
          <div class="title">
            <span>
              <svg @click="closeModal()">
                <use
                  xlink:href="./../assets/images/symbol-defs.svg#icon-cross"
                ></use>
              </svg>
            </span>
            <span class="title-text">編輯個人資料</span>
            <span
              class="validation-error"
              v-show="
                editNameContent.length > 20 || editIntroContent.length > 160
              "
            >
              編輯字數不符限制
            </span>
            <button
              :disabled="
                editNameContent.length > 20 || editIntroContent.length > 160
              "
              @click="saveProfile"
            >
              儲存
            </button>
          </div>

          <div class="bg-wraper">
            <svg>
              <use
                xlink:href="./../assets/images/symbol-defs.svg#icon-camera"
              ></use>
            </svg>
            <svg>
              <use
                xlink:href="./../assets/images/symbol-defs.svg#icon-cross"
              ></use>
            </svg>
          </div>

          <div class="avatar-wraper">
            <svg>
              <use
                xlink:href="./../assets/images/symbol-defs.svg#icon-camera"
              ></use>
            </svg>
          </div>

          <div class="profile-input-group">
            <label for="profile-name">名稱</label>
            <input
              type="text"
              name=""
              id="profile-name"
              v-model="editNameContent"
            />
            <span>{{ editNameContent.length }}/20</span>
            <label for="profile-intro">自我介紹</label>
            <textarea
              name=""
              id="profile-intro"
              v-model="editIntroContent"
            ></textarea>
            <span>{{ editIntroContent.length }}/160</span>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import ContentPoster from './ContentPoster.vue'
export default {
  components: { ContentPoster },
  data() {
    return {
      typingContents: '',
      validationErrMsg: '',
      editNameContent: '',
      editIntroContent: '',
      camMode: ''
    }
  },
  computed: {
    isDataLoaded() {
      return Object.hasOwn(this.sourcePostOrComment, 'author')
    },
    isActivated() {
      return this.$store.state.isModalOpened
    },
    modalType() {
      return this.$store.state.modalType
    },
    source() {
      return {
        id: this.$store.state.sourcePostOrComment.id,
        modalType: this.$store.state.sourcePostOrComment.modalType
      }
    },
    videoStream() {
      return this.$store.state.videoStream
    },
    isTakingPhoto() {
      return this.$store.state.videoStream ? true : false
    }
  },
  watch: {
    typingContents(newVal) {
      if (!newVal.length) {
        this.validationErrMsg = '內容不可為空'
      } else if (newVal.length > 10) {
        this.validationErrMsg = '字數不可超過 140 字'
      } else {
        this.validationErrMsg = ''
      }
    },
    isTakingPhoto(newVal) {
      if (newVal) {
        this.camMode = 'environment'
        this.$refs.video.srcObject = this.videoStream
        this.$refs.video.play()
      }
    }
  },
  methods: {
    saveProfile() {
      // TODO: 
      alert('hi')
    },
    closeModal() {
      this.$store.commit('TOGGLE_MODAL')
    },
    focusInput() {
      this.$refs.txtarea.focus()
    },
    snapShot() {
      // * save generated canvas dataUrl and converted File
      // to Vuex then turn off the modal
      const ctx = this.$refs.canvas.getContext('2d')
      this.$refs.canvas.width = this.$refs.video.width
      this.$refs.canvas.height = this.$refs.video.height
      ctx.drawImage(this.$refs.video, 0, 0, this.$refs.video.width, this.$refs.video.height)
      
      const imgUrl = this.$refs.canvas.toDataURL('image/jpeg')
      this.$store.state.snapUrl = imgUrl

      this.$refs.canvas.toBlob((blob) => {
        this.$store.state.snapFile = new File([blob], 'fileToUpload.jpg', { type: 'image/jpeg' })
      }, 'image/jpeg')

      this.cancelPhotoTaking()
    },
    async switchCam() {
      // * stop webcam first
      const videoStream = this.$store.state.videoStream
      const tracks = videoStream.getTracks()
      tracks.forEach(track => track.stop())

      const modeToSwitch = this.camMode === 'environment' ? 'user' : 'environment'
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: modeToSwitch }
        },
        audio: false
      })
      this.camMode = modeToSwitch
      this.$store.state.videoStream = stream
      this.$refs.video.srcObject = this.videoStream
      this.$refs.video.play()
    },
    cancelPhotoTaking() {
      // * stop webcam
      const videoStream = this.$store.state.videoStream
      const tracks = videoStream.getTracks()
      tracks.forEach(track => track.stop())

      this.$store.state.videoStream = ''
      this.closeModal()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

.content-poster {
  border-bottom: none;
  grid-row-gap: 5rem;
}

.modal {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba($color: $color-gray-700, $alpha: 0.5);

  @include respond($bp-mobile) {
    background-color: $color-gray-100;
  }
}

.post-input-group,
.profile-card {
  width: 50%;
  min-height: 25rem;
  margin: 5rem auto auto auto;

  background-color: $color-gray-100;
  border: 1px solid $color-gray-400;
  border-radius: 15px;

  .post-input-title {
    border-bottom: 1px solid $color-gray-500;
    padding: 1rem;
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
    fill: $color-brand;
    cursor: pointer;

    @include respond($bp-mobile) {
      fill: $color-gray-900;
    }
  }

  img {
    margin-top: 1.5rem;
    margin-left: 1rem;
  }

  @include respond($bp-mobile) {
    width: 100%;
    height: 100%;
    margin: 0;
    border: none;
    border-radius: 0;

    display: flex;
    flex-direction: column;

    .post-input-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .textarea-group {
      display: flex;
      margin-bottom: auto;
      img {
        align-self: flex-start;
      }
      textarea {
        height: 30rem;
        padding-top: 1rem;
      }
    }

    .validation-err-msg {
      text-align: end;
      color: $color-error;
      padding-bottom: 2rem;
    }
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

  @include respond($bp-mobile) {
    display: inline-block;
    margin-top: 0;
    margin-left: auto;
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
  grid-template-rows: 2rem min-content min-content;
  grid-column-gap: 1rem;

  margin-top: 1rem;
  position: relative;

  &::after {
    content: '';
    width: 0.15rem;
    height: calc(100% - 5.5rem);
    background-color: $color-gray-300;
    position: absolute;
    left: 3.25rem;
    top: 6rem;
  }

  img {
    margin-top: 0;
  }

  .text-content {
    grid-column: 2/-1;
  }

  p {
    padding: 1rem 1rem 1rem 0;
    border-bottom: none;
    &:last-child {
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
  height: min-content;
  padding-bottom: 1.5rem;

  @include respond($bp-mobile) {
    height: 100%;
  }
}

// edit-profile
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
  margin-top: 0.5rem;
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
    transition: fill 0.2s ease-in;

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

  transform: translate(1rem, -50%);

  svg {
    position: absolute;
    top: calc(37.5% + 5px);
    left: calc(37.5% - 5px);
    fill: $color-gray-100;
    margin: 0 1rem;
    width: 2.4rem;
    height: 2.4rem;
    transition: fill 0.2s ease-in;

    &:hover {
      fill: $color-gray-300;
    }
  }
}

.profile-input-group {
  margin-top: -6rem;
  display: flex;
  flex-direction: column;

  label,
  input,
  textarea {
    background-color: $color-gray-200;
  }

  label {
    color: $color-gray-800;
    padding-bottom: 0.5rem;
  }

  input {
    border: none;
    &:focus {
      outline: none;
    }
  }

  input,
  textarea {
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

.photo-taking {
  position: ralative;
  width: 80%;
  max-width: 50rem;
  height: 80%;
  margin: 0 auto;

  position: relative;
  z-index: 999;

  video {
    width: 100%;
  }


  &__controls {
    position: absolute;
    bottom: 2%;
    width: 100%;
    display: flex;
    justify-content: space-around;

    margin: 3rem auto;

    svg {
      fill: $color-brand;
      width: 5rem;
      height: 5rem;
      cursor: pointer;

      transition: transform .2s;

      &:hover,
      &:active {
        fill: $color-brand-deep;
        transform: scale(1.2 , 1.2);
      }
    }
  }
}

// transitions

.modal-fade-enter-active {
  transition: all 0.2s ease-in-out;
}

.modal-fade-leave-active {
  transition: all 0.2s ease-in-out 0.3s;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
  transform-origin: top left;
  transform: scale(0);
}

.modal-fade-enter-to,
.modal-fade-leave {
  opacity: 1;
  transform-origin: top left;
  transform: scale(1);
}

.modal-inner-offset-enter-active {
  transition: transform 0.2s ease-in-out 0.3s;
}

.modal-inner-offset-leave-active {
  transition: transform 0.2s ease-in-out;
}

.modal-inner-offset-enter,
.modal-inner-offset-leave-to {
  transform: translateY(-130%);
}

.modal-inner-offset-enter-to,
.modal-inner-offset-leave {
  transform: translateY(0);
}
</style>