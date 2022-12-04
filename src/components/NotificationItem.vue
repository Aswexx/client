<template>
  <div class="notif" :class="{ read: notif.isRead }" @click="direct(notif)">
    <img class="notif__avatar"
      :src="notif.informer.avatarUrl"
      @error="useFallbackImg"
    />
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
                const timeFormat = (timestamp) => {
                  return this.$format(
                    new Date(timestamp),
                    'yyyy-MM-dd HH:mm:ss',
                    {
                      locale: this.$zhTW
                    }
                  )
                }
                const timeValue = parsedMsg.createdTime || parsedMsg.createdAt
                const formattedCreatedTime = timeFormat(timeValue)

                return {
                  contents: parsedMsg.message || parsedMsg.contents,
                  createdTime: formattedCreatedTime,
                  isSenderMsg:
                    parsedMsg.sender === this.$store.getters.loginedUserId ||
                    parsedMsg.senderId === this.$store.getters.loginedUserId
                }
              })
              this.$store.commit('LOAD_MESSAGE', mappedMessages)
            })

            chatSocket.on('existRoomId', async (roomId) => {
              const { existRoomId, chatRecord } = roomId
              const mappedChatRecord = chatRecord.map((c) => {
                const parsedMsg = JSON.parse(c)
                return {
                  contents: parsedMsg.message,
                  createdTime: this.$format(
                    new Date(parsedMsg.createdTime),
                    'yyyy-MM-dd HH:mm:ss',
                    {
                      locale: this.$zhTW
                    }
                  ),
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
              msg.createdTime = this.$format(
                new Date(msg.createdTime),
                'yyyy-MM-dd HH:mm:ss',
                { locale: this.$zhTW }
              )
              this.$store.commit('SAVE_MESSAGE', msg)
            })
          }
          chatSocket.emit('joinRoom', {
            triggerUser: notif.informerId,
            targetUser: this.$store.getters.loginedUserId,
            isTargetUserSponsor: this.$store.getters.loginedUser.isSponsor
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
    },
    useFallbackImg(event) {
      event.target.src = require('@/assets/images/default_avatar1.png')
    },
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
        case 'mention':
          return `${notif.informer.name} 提到了你`
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
    },
  }
}
</script>

<style lang="scss" scoped>
.notif {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem 0.5rem 0;
  border-bottom: 1px solid $color-gray-400;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease-in;

  &__avatar {
    margin-right: 1rem;
  }

  &__description {
    flex: 1;
  }

  &:hover {
    background-color: rgba($color-brand, 0.4);
  }
}

.read {
  color: $color-gray-300;
}
</style>
