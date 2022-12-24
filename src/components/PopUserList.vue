<template>
  <div class="pop-user-list">
    <div class="controls">
      <SearchBar class="search-bar" @typing="setKeyword"></SearchBar>
      <div class="toggle-follow-list">
        <button
          @click="showFilteredUsers('all')"
          :class="{ active: controlMode === 'all' }"
        >
          全部
        </button>
        <button
          @click="showFilteredUsers('following')"
          :class="{ active: controlMode === 'following' }"
        >
          我的關注
        </button>
        <button
          @click="showFilteredUsers('followedBy')"
          :class="{ active: controlMode === 'followedBy' }"
        >
          關注我的用戶
        </button>
      </div>
    </div>
    <div class="user-card-wraper">
      <div
        class="user-card"
        @click="toUserProfile(user.id)"
        v-for="user in showingUsers"
        :key="user.id"
      >
        <img :src="user.avatarUrl" alt="avatar" @error="useFallbackImg" />
        <h5>{{ user.name }}</h5>
        <div class="interact">
          <button
            :class="{ 'not-follow': !showFollowState(user) }"
            @click.stop="toggleFollow(user)"
          >
            {{ showFollowState(user) ? '已追隨' : '追隨' }}
          </button>
          <svg class="chat-icon" @click.stop="triggerChat(user)">
            <use xlink:href="../assets/images/symbol-defs.svg#icon-chat"></use>
          </svg>
        </div>
        <span>@{{ user.alias }}</span>
        <div class="spot" v-if="Number($store.state.onlineUsers[user.id])"></div>
      </div>

      <div class="page-switcher">
        <button v-show="showUsersFromIndex" @click="showPrevOrNextPage(-10)">
          上一頁
        </button>
        <button v-show="!isLastPage" @click="showPrevOrNextPage(10)">
          下一頁
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'
export default {
  name: 'PopUserList',
  components: { SearchBar },
  data() {
    return {
      showingUsers: [],
      showUsersFromIndex: 0,
      isLastPage: false,
      keyword: '',
      filteredUsers: [],
      controlMode: '' //*all/ following / followedBy/ filter
    }
  },
  watch: {
    keyword: {
      immediate: true,
      handler(newVal) {
        this.controlMode = 'filter'
        const allUsers = this.$store.state.userAbout.users
        const loginedUserId = this.$store.getters.loginedUserId
        const keyword = new RegExp(newVal, 'i')
        this.filteredUsers = allUsers.filter(
          (user) => keyword.exec(user.alias) && user.id !== loginedUserId
        )

        this.showUsersFromIndex = 0
        this.showPrevOrNextPage(0)
      }
    }
  },
  methods: {
    setKeyword(keyword) {
      this.keyword = keyword
    },
    useFallbackImg(event) {
      event.target.src = require('@/assets/images/default_avatar1.png')
    },
    async toggleFollow(user) {
      const isFollowing = this.showFollowState(user)
      if (!isFollowing) {
        const newFollowship = await this.$axios.post(
          `${this.$API_URL}/users/follow`,
          {
            followerId: this.$store.getters.loginedUserId,
            followedId: user.id
          }
        )
        user.followed.unshift(newFollowship.data)
        this.showingUsers.forEach((showingUser) => {
          if (showingUser.id === user.id) {
            showingUser.followed = user.followed
          }
        })
      } else {
        const followshipToRemove = user.followed.find((followship) => {
          return followship.followerId === this.$store.getters.loginedUserId
        })
        const followedIndex = user.followed.indexOf(followshipToRemove)

        await this.$axios.delete(
          `${this.$API_URL}/users/follow/${followshipToRemove.id}`
        )
        user.followed.splice(followedIndex, 1)
        this.showingUsers.forEach((showingUser) => {
          if (showingUser.id === user.id) {
            showingUser.followed = user.followed
          }
        })
      }
    },
    showFollowState(user) {
      // * return state about the followship between logined user and other user
      if (!user.followed.length) {
        return false
      }

      return user.followed.find(
        (followship) =>
          followship.followerId === this.$store.getters.loginedUserId
      )
    },
    async toUserProfile(userId) {
      // //* implement state mutations directly
      // //* if current route is NOT 'profile/posts'、'profile/replies' or 'profile/likes'
      switch (this.$route.name) {
        case 'posts':
          break
        case 'replies':
          this.$router.push({
            name: 'posts',
            params: { userId }
          })
          break
        case 'likes':
          break
        default:
          return this.$router.push({
            name: 'posts',
            params: { userId }
          })
      }

      await this.$store.dispatch('postAbout/getUserPosts', userId)
      await this.$store.dispatch('userAbout/getUser', userId)
    },
    showFilteredUsers(controlMode) {
      this.isLastPage = false
      const allUsers = this.$store.state.userAbout.users
      const loginedUserId = this.$store.getters.loginedUserId
      switch (controlMode) {
        case 'all':
          this.controlMode = 'all'
          this.filteredUsers = allUsers.filter(
            (user) => user.id !== loginedUserId
          )
          break
        case 'following':
          this.controlMode = 'following'
          this.filteredUsers = allUsers.filter((user) =>
            user.followed.find(
              (followship) => followship.followerId === loginedUserId
            )
          )
          break
        case 'followedBy':
          this.controlMode = 'followedBy'
          this.filteredUsers = allUsers.filter((user) =>
            user.follow.find(
              (followship) => followship.followedId === loginedUserId
            )
          )
      }

      this.showingUsers = this.filteredUsers.slice(0, 10)
      this.showUsersFromIndex = 0
      if (this.filteredUsers.length <= 10) {
        this.isLastPage = true
      }
    },
    showPrevOrNextPage(numToChangeIndexFrom) {
      const userCount = this.filteredUsers.length
      let usersToLoad

      this.showUsersFromIndex += numToChangeIndexFrom

      usersToLoad = this.filteredUsers.slice(
        this.showUsersFromIndex,
        this.showUsersFromIndex + 10
      )

      this.showingUsers = usersToLoad
      if (
        this.showUsersFromIndex + 10 >= userCount &&
        numToChangeIndexFrom >= 0
      ) {
        this.isLastPage = true
      } else {
        this.isLastPage = false
      }
    },
    async triggerChat(targetUser) {
      this.$store.dispatch('sendChatNotification', targetUser.id)
      this.$store.commit('RESET_CHAT_STATE')
      // * use logined user id as roomId to specify the chat room allow target user to join
      let chatSocket = this.$store.state.chatSocket
      // * avoid duplicate connection and event listening
      if (!chatSocket) {
        chatSocket = await this.$io(`${this.$store.state.API_URL}/chat`)
        chatSocket.on('newMsg', (msgInfo) => {
          msgInfo.createdTime = this.$format(
            new Date(msgInfo.createdTime),
            'yyyy-MM-dd HH:mm:ss',
            {
              locale: this.$zhTW
            }
          )
          this.$store.commit('SAVE_MESSAGE', msgInfo)
        })

        chatSocket.on('existRoomId', async (roomId) => {
          const { existRoomId, chatRecord } = roomId
          const mappedChatRecord = chatRecord.map((c) => {
            const parsedMsg = JSON.parse(c)
            const timeFormat = (timestamp) => {
              return this.$format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss', {
                locale: this.$zhTW
              })
            }
            const timeValue = parsedMsg.createdTime || parsedMsg.createdAt
            const formattedCreatedTime = timeFormat(timeValue)
            console.log({ timeValue, formattedCreatedTime })
            return {
              contents: parsedMsg.message || parsedMsg.contents,
              createdTime: formattedCreatedTime,
              isSenderMsg:
                parsedMsg.sender === this.$store.getters.loginedUserId ||
                parsedMsg.senderId === this.$store.getters.loginedUserId
            }
          })
          await this.$store.commit('SET_ROOM_ID', existRoomId)
          await this.$store.commit('LOAD_MESSAGE', mappedChatRecord)
        })

        chatSocket.on('checkRoomId', (roomInfo) => {
          const { roomId, chatRecord } = roomInfo
          this.$store.commit('SET_ROOM_ID', roomId)

          const mappedMessages = chatRecord.map((msg) => {
            const parsedMsg = JSON.parse(msg)
            const timeFormat = (timestamp) => {
              return this.$format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss', {
                locale: this.$zhTW
              })
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

        this.$store.commit('SET_CHAT_SOCKET', chatSocket)
      }

      chatSocket.emit('startChat', {
        triggerUser: this.$store.getters.loginedUserId,
        targetUser: targetUser.id,
        isTriggerUserSponsor: this.$store.getters.loginedUser.isSponsor
      })

      await this.$store.commit('TRIGGER_CHAT', {
        loginedUserId: this.$store.getters.loginedUserId,
        targetUser
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-user-list {
  height: 98vh;
  top: 0;
  grid-column: 3/4;
  @include respond($bp-mobile) {
    display: none;
  }
}

.controls {
  padding: 1rem 0 1rem 0;
  border-bottom: 1px solid $color-gray-600;

  .toggle-follow-list {
    display: flex;

    button {
      font-size: 1.4rem;
      padding: 0.5rem 1rem 0.5rem 1rem;
      background-color: $color-gray-400;
      border-radius: unset;
      &.active {
        background-color: $color-brand;
      }
      &:first-of-type {
        border-radius: 3rem 0 0 3rem;
      }
      &:last-of-type {
        border-radius: 0rem 3rem 3rem 0;
      }
    }
  }

  @include respond($bp-mobile) {
    display: flex;
    justify-content: space-between;

    .search-bar {
      flex: 1;
    }
  }
}

.user-card-wraper {
  height: 87.5%;
  padding: 0 1rem 0 0;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .not-follow {
    background-color: $color-gray-100;
    color: $color-brand;
    border: 1px solid $color-brand;
    width: 6.4rem;
    justify-self: end;

    &:hover {
      color: $color-brand-deep;
    }
  }

  button {
    padding: 0.5rem 1rem 0.5rem 1rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    svg {
      all: none;
      width: 2rem;
      height: 2rem;
    }
  }
  .page-switcher {
    align-self: center;
  }
}

.user-card {
  position: relative;
  padding: 1rem 0;
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  grid-column-gap: 0.5rem;

  align-items: center;
  cursor: pointer;

  box-shadow: inset 0 0 0 0 $color-brand;
  transition: color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  .interact {
    grid-row: 1/3;
    display: flex;
    flex-direction: column;

    .chat-icon {
      width: 2rem;
      height: 2rem;
      align-self: flex-end;
      stroke: $color-brand;
      cursor: pointer;
      transition: all 0.2s ease-in;

      &:hover {
        transform: scale(1.3);
      }
    }

    @include respond($bp-mobile) {
      flex-direction: row;
      justify-content: space-between;
      width: 11rem;

      .chat-icon {
        width: 3.5rem;
        height: 3.5rem;
      }
    }
  }

  .spot {
    position: absolute;
    top: 0.5rem;
    left: 0rem;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background-color: #29c25c;
  }

  img {
    grid-row: 1/3;
  }

  span {
    grid-column: 2/3;
    grid-row: 2/3;
  }

  &:hover {
    box-shadow: inset 20px 0 0 0 $color-brand;
  }
}

h5,
span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
