<template>
  <div class="pop-user-list">
    <div class="controls">
      <h5>活躍人物</h5>
      <p>發文數最多</p>
      <input type="text" v-model="aliasFilter">
    </div>
    <div class="user-card-wraper">
      <div
        class="user-card"
        @click="toUserProfile(user.id)"
        v-for="user in users"
        :key="user.id"
      >
        <img :src="user.avatarUrl" alt="avatar" />
        <h5>{{ user.name }}</h5>
        <button
          :class="{ 'not-follow': !showFollowState(user) }"
          @click.stop="toggleFollow(user)"
        >
          {{ showFollowState(user) ? '正在追隨' : '追隨' }}
        </button>
        <span>@{{ user.alias }}</span>
      </div>

      <button class="load-more" @click="loadMoreUsers">載入更多</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopUserList',
  data() {
    return {
      users: [],
      currentUsersCount: 10,
      aliasFilter: ''
    }
  },
  computed: {
    // users(){
    //   const allUsers = this.$store.state.userAbout.users
    //   allUsers.sort((a,b) => {
    //     return b.posts.length - a.posts.length
    //   })
    //   return this.$store.state.userAbout.users.slice(0,10)
    // }
  },
  watch:{
    aliasFilter(newVal){
      const allUsers = this.$store.state.userAbout.users
      const keyword = new RegExp(newVal, 'i')
      this.users = allUsers.filter(user => keyword.exec(user.alias))
    }
  },
  methods: {
    toggleFollow(user) {
      const isFollowing = this.showFollowState(user)
      if (!isFollowing) {
        this.$store.dispatch('userAbout/addFollowship', user.id)
        return
      }

      const followship = user.followed.find(
        (r) => r.followerId === this.$store.getters.loginedUserId
      )
      return this.$store.dispatch('userAbout/removeFollowship', followship)
    },
    showFollowState(user) {
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

      await this.$store.dispatch('userAbout/getUser', userId)
      await this.$store.dispatch('postAbout/getUserPosts', userId)
    },
    loadMoreUsers() {
      const usersToLoad = this.$store.state.userAbout.users.slice(this.currentUsersCount,this.currentUsersCount + 10)
      this.currentUsersCount += 10
      this.users.push(...usersToLoad)
    }
  },
  beforeMount(){
    const allUsers = this.$store.state.userAbout.users
    allUsers.sort((a,b) => {
      return b.posts.length - a.posts.length
    })
    this.users = this.$store.state.userAbout.users.slice(0,10)
  }
}
</script>

<style lang="scss" scoped>
.pop-user-list {
  top: 0;
  height: 98vh;
  grid-column: 3/4;
  @include respond($bp-mobile) {
    display: none;
  }
}

.controls {
  padding: 1rem 0 1rem 0;
  border-bottom: 1px solid $color-gray-600;
}

.user-card-wraper {
  display: flex;
  flex-direction: column;
  height: 92vh;
  overflow-y: scroll;

  .not-follow {
    background-color: $color-gray-100;
    color: $color-brand;
    border: 1px solid $color-brand;
    width: 6.4rem;
    justify-self: end;

    &:hover {
      color: $color-sup-orange;
    }
  }

  button {
    padding: 1.2rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .load-more {
    align-self: center;
  }
}

.user-card {
  padding: 1rem 0;
  display: grid;
  grid-template-columns: min-content 1fr 1fr;
  grid-column-gap: 0.5rem;

  align-items: center;
  cursor: pointer;

  box-shadow: inset 0 0 0 0 $color-brand;
  transition: color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: inset 20px 0 0 0 $color-brand;
  }
}

h5 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// h4 {
//   height: 6.1rem;
//   border-bottom: 1px solid $color-gray-400;
//   padding: 1.5rem 0;
// }

img,
button {
  grid-row: 1/3;
}

span {
  grid-column: 2/3;
  grid-row: 2/3;
}
</style>
