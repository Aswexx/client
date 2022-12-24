<template>
  <div class="wrapper">
    <div class="tagedUserList">
      <a href="" v-for="(user,key) in tagedUserList" :key="key">
        @{{ key }}
      </a>
    </div>
    <textarea
      class="regular-input"
      :placeholder="placeholder"
      v-model="input"
      ref="input"
    >
    </textarea>

    <input type="file" hidden @change="readyToUpload" ref="fileInput" />

    <div class="tagUserPicker" v-show="tagUserPicker">
      <p
        class="user" 
        v-for="user in users" 
        :key="user.id"
        @click="tagUser({ userId: user.id, userAlias: user.alias })"
      >
        @{{ user.alias }}
      </p>
    </div>

    <div class="fileToUpload-wrapper" v-show="fileURL">
      <svg @click="cancelUpload"><use href="@/assets/images/symbol-defs.svg#icon-cross"></use></svg>
      <img class="fileToUpload" v-if="fileType === 'image'" :src="fileURL" />
      <div class="video-container" v-else>
        <video @click="togglePlay" :src="fileURL"></video>
      </div>
    </div>

    <EmojiPicker @emoji="append" :search="search" ref="emojiPicker">
      <button
        class="emoji-invoker"
        slot="emoji-invoker"
        slot-scope="{ events: { click: clickEvent } }"
        @click.stop="clickEvent"
      >
        <svg viewBox="0 0 24 24">
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-emoji"></use>
        </svg>
      </button>
      <div slot="emoji-picker" slot-scope="{ emojis, insert }">
        <div class="emoji-picker">
          <div class="emoji-picker__search">
            <input type="text" v-model="search" v-focus />
          </div>
          <div>
            <div v-for="(emojiGroup, category) in emojis" :key="category">
              <h5>{{ category }}</h5>
              <div class="emojis">
                <span
                  v-for="(emoji, emojiName) in emojiGroup"
                  :key="emojiName"
                  @click="insert(emoji)"
                  :title="emojiName"
                  >{{ emoji }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmojiPicker>
  </div>
</template>

<script>
import { EmojiPicker } from 'vue-emoji-picker'
export default {
  data() {
    return {
      input: '',
      tagUserPicker: false,
      tagedUserList: {},
      search: '',
      cursorPosition: 0,
      fileURL: '',
      fileToUpload: '',
      fileType: '',
      allowedExtensions: /(\.mp4|\.jpeg|\.jpg|\.png|\.gif)$/i
    }
  },
  watch: {
    input(newVal) {
      if (/@/.exec(newVal)) {
        this.tagUserPicker = true
      } else {
        this.tagUserPicker = false
      }

      const targetEl = this.$refs.input
      targetEl.style.height = 'auto'
      targetEl.style.height = targetEl.scrollHeight + 'px'
      targetEl.scrollTop = targetEl.scrollHeight
      window.scrollTo(
        window.scrollLeft,
        targetEl.scrollTop + targetEl.scrollHeight
      )
      this.cursorPosition = targetEl.selectionStart
    }
  },
  computed:{
    placeholder(){
      if (this.$route.name === 'home') return '有什麼新鮮事?'
      return '推你的回覆'
    },
    users() {
      const allUsers = this.$store.getters.users
      const atIndex = this.input.indexOf('@') + 1
      const keyword = this.input.substring(atIndex, this.input.length)
      const keywordRegExp = new RegExp(keyword, 'i')
      const filteredUsers = allUsers.filter(user => keywordRegExp.exec(user.alias))
      return filteredUsers
    }
  },
  components: { EmojiPicker },
  methods: {
    tagUser(userInfo) {
      const { userId, userAlias } = userInfo
      const currentInput = this.input
      const atIndex = currentInput.indexOf('@') + 1
      const keyword = currentInput.substring(atIndex, currentInput.length)

      this.input = this.input.replace(`@${keyword}`, '')
      this.tagedUserList[userAlias] = userId
      this.tagUserPicker = false
      this.$refs.input.focus()
    },
    append(emoji) {
      const targetEl = this.$refs.input
      const foreSubstring = this.input.slice(0, targetEl.selectionStart)
      const backSubstring = this.input.slice(targetEl.selectionStart)
      this.input = foreSubstring + emoji + backSubstring
    },
    showFilePicker(fileType) {
      const fileInput = this.$refs.fileInput
      fileInput.accept = fileType
      fileInput.click()
    },
    readyToUpload() {
      const fileList = this.$refs.fileInput.files
      this.fileToUpload = fileList[0]

      if (!this.allowedExtensions.exec(this.fileToUpload.name)) {
        this.$store.commit('TRIGGER_TOAST', {
          type: 'info',
          detail: '目前支援的圖片檔案格式: jpeg、jpg、gif、png',
        })
        // * clear fileList via value property because files prop is read-only
        this.$refs.fileInput.value = ''
        return
      }

      if (fileList.length) {
        const fileURL = URL.createObjectURL(fileList[0])
        this.fileURL = fileURL
      }

      this.fileType =
        this.fileToUpload.name.slice(-4) === '.mp4' ? 'film' : 'image'
    },
    cancelUpload() {
      this.$refs.fileInput.value = ''
      this.fileToUpload = ''
      this.fileURL = ''
    },
    togglePlay(event) {
      const video = event.target
      if (video.paused || video.ended) {
        video.play()
      } else {
        video.pause()
      }
    }
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.wrapper {
  position: relative;
  display: inline-block;
}

.fileToUpload-wrapper {
  position: relative;
  svg {
    position: absolute;
    top: -1rem;
    left: -1rem;
    width: 2rem;
    height: 2rem;
    padding: .3rem;
    border-radius: 50%;
    border: 2px solid $color-brand;
  }
}

.regular-input {
  font-size: 1.8rem;
  width: 95%;
  color: $color-gray-500;
  font-weight: bold;
  resize: none;
  overflow-y: hidden;
  border: none;
  outline: none;

  &:focus {
    color: $color-gray-900;
  }
}

.tagUserPicker {
  background-color: $color-gray-100;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  height: 13rem;
  overflow-x: hidden;
  overflow-y: auto;

  box-shadow: 12px 9px 19px 5px $color-gray-600;
  border-radius: 1rem;

  p {
    cursor: pointer;
  }

  p:hover {
    background-color: $color-brand;
    color: $color-gray-100;
  }
}

.tagedUserList {
  a {
    color: $color-primary;
  }
}

.emoji-invoker {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  background: transparent;
  border: 0;
}
.emoji-invoker:hover {
  transform: scale(1.1);
}
.emoji-invoker > svg {
  fill: $color-brand;
}

.emoji-picker {
  position: absolute;
  left: 0;
  z-index: 1;
  font-family: Montserrat;
  border: 1px solid #ccc;
  width: 30rem;
  height: 20rem;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 1px 1px 8px #c7dbe6;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 0;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: '';
  flex: auto;
}
.emoji-picker .emojis span {
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}

img {
  width: 100%;
  height: unset;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 10px;
}
</style>