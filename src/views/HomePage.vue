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
      // const showingPosts = this.$store.state.postAbout.showingPosts
      // delete showingPosts.postCount

      // return showingPosts
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
    if (this.$store.getters.unreadNotifs) return
    this.$store.dispatch('getNotifications')
  },
  mounted() {
    let notificationSocket = this.$store.state.notifSocket
    console.log(notificationSocket)
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
        console.log(notification)
        this.$store.commit('ADD_NOTIFICATION', notification)
      })

    }
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

@include respond($bp-mobile) {
  .home {
    .post-input-group {
      display: none;
    }
  }
}

.post-list {
  height: 73vh;
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
