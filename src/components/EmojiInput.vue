<template>
  <div class="wrapper">
    <textarea
      class="regular-input"
      placeholder="推你的回覆"
      v-model="input"
      ref="input"
    >
    </textarea>

    <input type="file" hidden @change="readyToUpload" ref="fileInput" />
    <div class="fileToUpload-wrapper" v-show="fileURL">
      <span @click="cancelUpload">X</span>
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
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 fill-current text-grey"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
          />
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
      search: '',
      cursorPosition: 0,
      fileURL: '',
      fileToUpload: '',
      fileType: '',
      allowedExtensions: /(\.mp4|\.jpeg|\.png|\.gif)$/i
    }
  },
  components: { EmojiPicker },
  methods: {
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

      console.log(this.fileToUpload.name)
      if (!this.allowedExtensions.exec(this.fileToUpload.name)) {
        // TODO: optimize notation
        alert('invalid')
        return
      }

      if (fileList.length) {
        const fileURL = URL.createObjectURL(fileList[0])
        this.fileURL = fileURL
      }

      console.log(this.fileToUpload.name.slice(-4))

      this.fileType =
        this.fileToUpload.name.slice(-4) === '.mp4' ? 'film' : 'image'
    },
    cancelUpload() {
      this.fileToUpload = ''
      this.fileURL = ''
    },
    togglePlay(event) {
      const video = event.target
      console.log(video)
      if (video.paused || video.ended) {
        video.play()
      } else {
        video.pause()
      }
    }
  },
  watch: {
    input() {
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
@import './../assets/scss/abstracts.scss';

.wrapper {
  position: relative;
  display: inline-block;
}

.regular-input {
  font-size: 1.8rem;
  width: 95%;
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
  fill: #b1c6d0;
}

.emoji-picker {
  position: absolute;
  left: 0;
  z-index: 1;
  font-family: Montserrat;
  border: 1px solid #ccc;
  width: 30rem;
  height: 20rem;
  overflow: scroll;
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
  height: 50%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 10px;
}
</style>