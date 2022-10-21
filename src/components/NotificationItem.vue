<template>
  <div class="notif" :class="{ read: notif.isRead }" @click="direct(notif)">
    <img src="../assets/images/default_avatar1.png" alt="avatar" />
    <span class="notif__description">{{ description }}</span>
    <span>{{ formattedTime }}</span>
  </div>
</template>

<script>
export default {
  props: {
    notif: {
      type: Object,
      required: true
    }
  },
  methods: {
    async direct(notif) {
      this.read(notif)
      let chatSocket = this.$store.state.chatSocket
      switch (notif.notifType) {
        case 'follow':
          this.$router.push({
            name: 'posts',
            params: { userId: notif.informerId }
          })
          break
        case 'inviteChat':
          // this.$store.commit('TRIGGER_CHAT', notif.informerId)
          // * if trigger has been offline
          // * ............

          // * if trigger is online
          if (!chatSocket) {
            chatSocket = await this.$io(`${this.$store.state.API_URL}/chat`)
            this.$store.commit('SET_CHAT_SOCKET', chatSocket)

            chatSocket.on('checkRoomId', (roomInfo) => {
              const { roomId, chatRecord } = roomInfo
              this.$store.commit('SET_ROOM_ID', roomId)
              const mappedMessages = chatRecord.map((msg) => {
                const parsedMsg = JSON.parse(msg)
                return {
                  contents: parsedMsg.message,
                  createdTime: parsedMsg.createdTime,
                  isSenderMsg:
                    parsedMsg.sender === this.$store.getters.loginedUserId
                }
              })
              this.$store.commit('LOAD_MESSAGE', mappedMessages)
            })

            chatSocket.on('existRoomId', async (roomId) => {
              console.log('checkRoomId', roomId)
              const { existRoomId, chatRecord } = roomId
              const mappedChatRecord = chatRecord.map((c) => {
                const parsedMsg = JSON.parse(c)
                return {
                  contents: parsedMsg.message,
                  createdTime: parsedMsg.createdTime,
                  isSenderMsg:
                    parsedMsg.sender === this.$store.getters.loginedUserId
                }
              })
              await this.$store.commit('SET_ROOM_ID', existRoomId)
              await this.$store.commit('LOAD_MESSAGE', mappedChatRecord)
            })

            // * listening the message target user sends
            chatSocket.on('newMsg', (msg) => {
              console.log(msg)
              this.$store.commit('SAVE_MESSAGE', msg)
            })
          }
          chatSocket.emit('joinRoom', {
            triggerUser: notif.informerId,
            targetUser: this.$store.getters.loginedUserId
          })

          // * confirm target then render chat window
          this.$store.commit('JOIN_CHAT', notif.informerId)

          break
        case 'replyPost':
        case 'likePost': {
          const { data } = await this.$store.dispatch(
            'postAbout/getPost',
            notif.targetPostId
          )
          this.$router.push({
            name: 'post-detail',
            params: { post: data }
          })
          break
        }
        case 'replyComment':
        case 'likeComment': {
          const comment = await this.$store.dispatch(
            'commentAbout/getComment',
            notif.targetCommentId
          )

          const attachComments = await this.$store.dispatch(
            'commentAbout/getAttachComments',
            notif.targetCommentId
          )

          this.$router.push({
            name: 'comment-detail',
            params: { comment, attachComments }
          })
          break
        }
      }
    },
    read(notif) {
      this.$store.commit('TURN_NOTIF_READ', notif.id)
    }
  },
  computed: {
    description() {
      const notif = this.notif
      switch (notif.notifType) {
        case 'follow':
          return `${notif.informer.name} 追蹤了你`
        case 'inviteChat':
          return `${notif.informer.name} 邀請你進入聊天`
        case 'replyPost':
          return `${notif.informer.name} 評論了你的貼文`
        case 'replyComment':
          return `${notif.informer.name} 評論了你的評論`
        case 'likePost':
          return `${notif.informer.name} 喜歡你的貼文`
        case 'likeComment':
          return `${notif.informer.name} 喜歡你的評論`
        default:
          return ''
      }
    },
    formattedTime() {
      return this.$format(
        new Date(this.notif.createdAt),
        'yyyy-MM-dd HH:mm:ss',
        { locale: this.$zhTW }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.notif {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 100%;
  cursor: pointer;

  &__description {
    flex: 1;
  }
}

.read {
  color: $color-gray-300;
}
</style>
