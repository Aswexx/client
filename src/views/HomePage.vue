<template>
  <div class="home">
    <PageInfoBar />
    <ContentPoster />

    <div class="post-list" @scroll="loadMorePosts">
      <PostItem v-for="post in showingPosts" :key="post.id" :post="post">
      </PostItem>

      <LoadSpinner v-show="showLoader"></LoadSpinner>
    </div>
  </div>
</template>

<script>
import PageInfoBar from './../components/PageInfoBar.vue'
import PostItem from './../components/PostItem.vue'
import LoadSpinner from './../components/LoadSpinner.vue'
import ContentPoster from './../components/ContentPoster.vue'
import axios from 'axios'

// eslint-disable-next-line no-unused-vars
let notificationSocket

export default {
  name: 'HomePage',
  components: { PageInfoBar, PostItem, LoadSpinner, ContentPoster },
  data() {
    return {
      postContents: '',
      validationErrMsg: '內容不可為空',
      postCount: 0,
      showLoader: false
    }
  },
  watch: {
    postContents(newVal) {
      if (newVal.length === 0) {
        this.validationErrMsg = '內容不可為空'
      } else if (newVal.length > 10) {
        this.validationErrMsg = '字數不可超過 140 字'
      } else {
        this.validationErrMsg = ''
      }
    }
  },
  computed: {
    showingPosts() {
      return this.$store.state.postAbout.showingPosts
    }
  },
  methods: {
    submitNewPost() {
      this.$store.dispatch('postAbout/submitNewPost', this.postContents)
      this.postContents = ''
    },
    async loadMorePosts(event) {
      const { scrollTop, scrollHeight, clientHeight } = event.target

      if (scrollTop + clientHeight >= scrollHeight) {
        //* exclude loadSpinner
        if (this.postCount === event.target.children.length - 1) {
          console.log('scroll event canceled')
          return
        }
        this.postCount = event.target.children.length - 1
        this.showLoader = true

        // * get more posts base on current posts
        const { data } = await axios.get(
          `${this.$store.state.API_URL}/posts/home-page`,
          {
            params: { skipPostsCount: this.postCount, take: 10 }
          }
        )

        // * modify data structure recieved from backend
        delete data.postCount

        setTimeout(() => {
          this.showLoader = false
          this.$store.state.postAbout.showingPosts.push(...Object.values(data))
        }, 2000)
      }
    }
  },
  beforeCreate() {
    this.$store.dispatch('postAbout/getHomePagePosts')
  },
  async mounted() {
    let notificationSocket = this.$store.state.notifSocket
    if (!notificationSocket) {
      notificationSocket = this.$io(`${this.$store.state.API_URL}/notification`)
      notificationSocket.on('connect', ()=> {
        notificationSocket.emit('setOnlineUser', this.$store.getters.loginedUserId)
        notificationSocket.emit('setChannel', this.$store.getters.loginedUserId)
      })

      this.$store.commit('SET_NOTIF_SOCKET', notificationSocket)

      notificationSocket.on('onlineUsers', (users) => {
        this.$store.commit('UPDATE_ONLINE_USERS', users)
      })

      notificationSocket.on('notification', (notification) => {
        this.$store.commit('ADD_NOTIFICATION', notification)
      })

      notificationSocket.on('disconnect', () => {
        //TODO: do someting when server shut down
      })
    }

    // * handle read state of notifications
    const previousReadNotifs = JSON.parse(localStorage.getItem('previousReadNotifs'))
    const notifications = JSON.parse(sessionStorage.getItem('previousNotifs'))
    if (previousReadNotifs && previousReadNotifs.length) {
      notificationSocket.emit('updateNotifsReadState', previousReadNotifs)
    }

    if (notifications && notifications.length) {
      this.$store.commit('ADD_NOTIFICATION', notifications)
      sessionStorage.clear()
    } else if (!this.$store.state.notifications.length) {
      await this.$store.dispatch('getNotifications')
    }

    window.addEventListener('unload', () => {
      const readNotifs = this.$store.state.readNotifs
      const notifications = this.$store.state.notifications
      localStorage.setItem('previousReadNotifs', JSON.stringify(readNotifs))
      sessionStorage.setItem('previousNotifs', JSON.stringify(notifications))
    })
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

.home {
  height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
}

@include respond($bp-mobile) {
  .home {
    height: calc(100vh - 6rem);

    display: flex;
    flex-direction: column;
    .post-input-group {
      display: none;
    }
  }
}

.post-list {
  overflow-y: auto;
}

.post-input-group {
  height: 12.5rem;
  border-bottom: 5px solid $color-gray-400;
  padding-top: 1.5rem;
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  button {
    width: 7.5rem;
    padding: 1rem 1.25rem;
    display: block;
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
</style>
