<template>
  <transition name="modal-fade">
    <div
      class="chat-room-wrapper"
      :class="{ active: isActivated }"
      draggable="true"
      ref="chatRoomWrapper"
    >
      <div class="opened-chat-list">
        <img
          :class="{ active: user.id === currentChatTarget.id }"
          v-for="user in chatTargetList"
          :key="user.id"
          :src="user.avatarUrl"
          @click="switchChatTo(user)"
          @error="setAltImg"
        />
      </div>
      <svg class="icon-minimize" @click="minimize">
        <use xlink:href="../assets/images/symbol-defs.svg#icon-minimize"></use>
      </svg>

      <div
        class="chat-room"
        v-if="currentChatTarget"
        :class="{ 'zoom-out': isZoomOut }"
      >
        <div class="chat-room__header">
          <img :src="currentChatTarget.avatarUrl" alt="pic" />
          <div class="info">
            <h5>{{ currentChatTarget.name }}</h5>
            <span>在/不在線上</span>
          </div>

          <div class="controls">
            <svg @click="endChat">
              <use
                xlink:href="./../assets/images/symbol-defs.svg#icon-cross"
              ></use>
            </svg>
          </div>
        </div>
        <div class="chat-room__contents" @click="scrollToBottom" ref="chatBody">
          <div
            v-for="(msg, index) in msgCollection"
            :key="index"
            :class="{
              'chat-room__msg-wrapper': !msg.isSenderMsg,
              'chat-room__msg-wrapper--user': msg.isSenderMsg,
            }"
          >
            <template v-if="!msg.isSenderMsg">
              <span>{{ msg.createdTime }}</span>
              <p class="chat-room__contents--msg">{{ msg.contents }}</p>
            </template>

            <template v-else>
              <span><b>我於</b>{{ msg.createdTime }}</span>
              <p class="chat-room__contents--user-msg">{{ msg.contents }}</p>
            </template>
          </div>
        </div>
        <div class="chat-room__sender">
          <input
            v-model="message"
            @keyup.enter="sendMessage"
            @focus="scrollToBottom"
          />
          <button @click="sendMessage">SEND</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      message: "",
      isZoomOut: false,
    };
  },
  props: ["dropPosition"],
  computed: {
    chatTargetList() {
      return this.$store.state.chatTargetList;
    },
    isActivated() {
      return this.$store.state.isChatActivated;
    },
    currentChatTarget() {
      return this.$store.state.currentChatTarget;
    },
    msgCollection() {
      return this.$store.state.currentMsgCollection;
    },
  },
  watch: {
    dropPosition: {
      deep: true,
      handler(newVal) {
        const chatRoomWrapper = this.$refs.chatRoomWrapper;
        console.log(newVal.top);
        chatRoomWrapper.style.top = newVal.top + "px";
        chatRoomWrapper.style.left = newVal.left + "px";
      },
    },
  },
  methods: {
    setAltImg(event) {
      if (event.target.className === "user-bg") {
        event.target.src = require("@/assets/images/default-profile-bg.jpg");
        return;
      }
      event.target.src = require("@/assets/images/default_avatar1.png");
    },
    minimize() {
      this.$store.commit("MINIMIZE_CHAT_SECTION");
    },
    scrollToBottom() {
      const chatBody = this.$refs.chatBody;
      chatBody.scrollTop = chatBody.scrollHeight - chatBody.clientHeight;
    },
    switchChatTo(target) {
      this.$store.commit("SWITCH_CHAT_TARGET", target);
      this.$store.commit("RESET_CHAT_STATE");
      // * update current chat roomId
      this.$store.state.chatSocket.emit("changeRoom", {
        triggerUser: this.$store.getters.loginedUserId,
        targetUser: this.$store.state.currentChatTarget.id,
      });
    },
    endChat() {
      const targetIndex = this.chatTargetList.indexOf(this.currentChatTarget);
      this.$store.commit("REMOVE_CHAT_TARGET", targetIndex);

      this.$store.state.chatSocket.emit("leaveRoom", {
        roomId: this.$store.state.chatRoomId,
        records: this.$store.state.currentMsgCollection,
      });
      this.$store.commit("RESET_CHAT_STATE");
    },
    sendMessage() {
      this.$store.state.chatSocket.emit("newMsg", {
        roomId: this.$store.state.chatRoomId,
        message: this.message,
        sender: this.$store.getters.loginedUserId,
        reciever: this.$store.state.currentChatTarget.id,
        createdTime: this.$format(Date.now(), "yyyy-MM-dd HH:mm:ss", {
          locale: this.$zhTW,
        }),
      })

      if (this.$store.state.chatSocket) {
        this.$store.state.chatSocket.on("checkRoomId", (roomInfo) => {
          const { roomId, chatRecord } = roomInfo;
          this.$store.commit("SET_ROOM_ID", roomId);
          const mappedMessages = chatRecord.map((msg) => {
            const parsedMsg = JSON.parse(msg);
            return {
              contents: parsedMsg.message,
              createdTime: parsedMsg.createdTime,
              isSenderMsg:
                parsedMsg.sender === this.$store.getters.loginedUserId,
            };
          });
          this.$store.commit("LOAD_MESSAGE", mappedMessages);
        });
      }

      this.msgCollection.push({
        isSenderMsg: true,
        contents: this.message,
        createdTime: this.$format(Date.now(), "yyyy-MM-dd HH:mm:ss", {
          locale: this.$zhTW,
        }),
      });

      this.message = "";

      const chatBody = this.$refs.chatBody;
      this.$nextTick(() => {
        chatBody.scrollTop = chatBody.scrollHeight - chatBody.clientHeight;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./../assets/scss/base.scss";

.chat-room-wrapper.active {
  position: absolute;
  right: 40%;
  bottom: 5%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  width: 60%;
  max-width: 50rem;
  height: 70vh;
  border-radius: 2rem;
  background-color: rgba($color: $color-gray-700, $alpha: 0.9);

  .opened-chat-list {
    display: flex;
    align-items: center;

    width: 80%;
    height: 7.5rem;
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;

    img {
      cursor: pointer;
      transition: all 0.2s ease-in;

      &.active {
        border: 1px solid $color-warning;
        scale: 1.1;
        border: double 0.3rem transparent;

        background-image: linear-gradient(white, white),
          radial-gradient(circle at top left, #f00, #3020ff);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
          0 6px 6px rgba(0, 0, 0, 0.23);
      }
    }
  }
  svg.icon-minimize {
    position: absolute;
    top: 1rem;
    right: 1rem;
    margin-left: auto;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
  }

  @include respond($bp-mobile) {
    width: 80%;
    right: 10%;
  }
}

.chat-room {
  display: flex;
  flex-direction: column;
  background-color: $color-sup-blue;
  width: 90%;
  height: 85%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0.2rem 0.2rem 2rem rgba($color-gray-100, 0.4);

  .controls {

    svg {
      margin: 0 0.5rem 0 0.5rem;
      width: 2rem;
      height: 2rem;
      cursor: pointer;
    }
  }

  &__msg-wrapper--user {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  &__header {
    display: flex;
    padding: 0.5rem;
    img {
      margin-right: 1.5rem;
    }
    .controls {
      flex: 1;
      text-align: end;
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
        transition: 0.2s ease;
      }
    }
  }

  &.zoom-out {
    display: none;
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

div::-webkit-scrollbar {
  height: 12px;
}
</style>
