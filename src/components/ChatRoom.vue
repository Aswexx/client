<template>
  <div class="chat-room-wrapper">
    <svg @click="closeChatRoom">
      <use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use>
    </svg>
    <div class="chat-room">
      <div class="chat-room__title">
        <h1>CHAT BOX</h1>
      </div>
      <div class="chat-room__contents" ref="chatBody">
        <div
          v-for="(msg, index) in msgCollection"
          :key="index"
          :class="{
            'chat-room__msg-wrapper': !msg.isSenderMsg,
            'chat-room__msg-wrapper--user': msg.isSenderMsg
          }"
        >
          <template v-if="!msg.isSenderMsg">
            <img src="../assets/images/default-avatar.jpg" alt="pic" />
            <span><b>Joseph</b>2022-08-23 20:21:32</span>
            <p class="chat-room__contents--msg">{{ msg.contents }}</p>
          </template>

          <template v-else>
            <span><b>我於</b>2022-08-23 20:23:31</span>
            <p class="chat-room__contents--user-msg">{{ msg.contents }}</p>
          </template>
        </div>
      </div>
      <div class="chat-room__sender">
        <input v-model="message" type="" />
        <button @click="sendMessage">SEND</button>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
let chatSocket

export default {
  data() {
    return {
      message: '',
      msgCollection: [
        { isSenderMsg: false, contents: 'wow' },
        { isSenderMsg: true, contents: 'hey' }
      ]
    }
  },
  methods: {
    closeChatRoom() {
      this.$store.commit('TOGGLE_CHAT')
      chatSocket.disconnect()
    },
    sendMessage() {
      chatSocket.emit('newMsg', this.message)
      this.msgCollection.push({
        isSenderMsg: true,
        contents: this.message
      })
      this.message = ''

      const chatBody = this.$refs.chatBody
      this.$nextTick(() => {
        chatBody.scrollTop = chatBody.scrollHeight - chatBody.clientHeight
      })
    }
  },
  mounted() {
    chatSocket = this.$io(`${this.$store.state.API_URL}/chat`)
    chatSocket.on('joined', (msg) => {
      console.log(msg)
    })

    // if (this.$route.name === 'notifications') {
    //   chatSocket.emit('startChat', notif.informerId)
    // }

    // * take userId as socket room id
    chatSocket.emit('startChat', this.$store.state.chatRoomId)

    chatSocket.on('newMsg', (msg) => {
      this.msgCollection.push({
        isSenderMsg: false,
        contents: msg
      })
    })
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

svg {
  width: 3rem;
  height: 3rem;
  cursor: pointer;
}

.chat-room-wrapper {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba($color: $color-gray-700, $alpha: 0.9);

  @include respond($bp-mobile) {
    background-color: $color-gray-100;
  }
}

.chat-room {
  position: absolute;
  top: 10%;
  left: 20%;

  display: flex;
  flex-direction: column;
  background-color: $color-sup-blue;
  width: 60%;
  height: 80vh;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0.2rem 0.2rem 2rem rgba($color-gray-100, 0.4);

  &__msg-wrapper {
    display: grid;
    grid-template-columns: min-content 1fr;
    column-gap: 1rem;
    row-gap: 0.5rem;

    img {
      grid-row: 1/3;
      margin-top: 1rem;
    }
  }

  &__msg-wrapper--user {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  &__title {
    h1 {
      color: $color-gray-100;
      padding: 1.5rem;
    }
  }

  &__contents {
    flex: 1;
    color: $color-gray-100;
    background-color: rgba($color-gray-100, 0.5);
    padding: 2rem 3rem;
    overflow-y: auto;
  }

  &__sender {
    display: flex;
    input {
      flex: 1;
      height: 4rem;
      border: none;
      outline: none;
      padding-left: 0.5rem;
      font-size: 1.6rem;
    }

    button {
      width: 10rem;
      font-size: 2rem;
      height: 4rem;
      border: none;
      background-color: $color-sup-blue;
      border-radius: 0;
      cursor: pointer;

      &:hover {
        background-color: blue;
        transition: 0.2s ease;
      }
    }
  }
}

.chat-room__contents {
  p {
    width: fit-content;
    padding: 1rem;
    border-radius: 1rem;
  }
  &--msg {
    background-color: $color-sup-blue;
    margin-bottom: 1.5rem;
  }

  &--user-msg {
    margin-left: auto;
    background-color: $color-gray-100;
    color: $color-gray-900;
  }
}
</style>