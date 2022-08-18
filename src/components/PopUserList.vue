<template>

  <div class="pop-user-list">
    <h4>活躍人物</h4>
    <div class="user-card-wraper">

      <div class="user-card"
        @click="toUserProfile(user.id)"
        v-for="user in users" :key="user.id">
        <img :src="user.avatar.url" alt="avatar">
        <h5>{{ user.name }}</h5>
        <button 
          :class="{'not-follow': !showFollowState(user)}"
          @click.stop="toggleFollow(user)">
          {{ showFollowState(user) ? '正在追隨' : '追隨' }}
        </button>
        <span>@{{ user.alias }}</span>
      </div>

    </div>
  </div>

</template>

<script>

export default {
  name: 'PopUserList',
  data(){
    return {
      users: this.$store.state.userAbout.popUsers,
    }
  },
  methods:{
    toggleFollow(user){
      const isFollowing = this.showFollowState(user)
      if (!isFollowing) {
        this.$store.dispatch('userAbout/addFollowship', user.id)
        return
      }

      const followship = 
        user.followed.find(r => r.followerId === this.$store.state.userAbout.loginedUserData.id)
      return this.$store.dispatch('userAbout/removeFollowship', followship)
    },
    showFollowState(user) {
      if (!user.followed.length) {
        return false
      }

      return user.followed.find(followship => followship.followerId === this.$store.state.userAbout.loginedUserData.id)
    },
    async toUserProfile(userId){
      //* implement state mutations directly
      //* if current route is NOT 'profile/posts'、'profile/posts' or 'profile/posts'
      switch (this.$route.name) {
        case 'posts':
          break
        case 'replies':
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
    }
  },
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/abstracts.scss';

.pop-user-list {
  grid-column: 3/4;
  @include respond($bp-mobile) {
    display: none;
  }
}

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

.user-card {
  padding: 1rem 0;
  display: grid;
  grid-template-columns: min-content 1fr 1fr;
  grid-column-gap: .5rem;

  align-items: center;
  cursor: pointer;

  box-shadow: inset 0 0 0 0 $color-brand;
  transition: color .3s ease-in-out, box-shadow .3s ease-in-out;

  &:hover {
    box-shadow: inset 20px 0 0 0 $color-brand;
  }
}

h5 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

h4 {
  height: 6.1rem;
  border-bottom: 1px solid $color-gray-400;
  padding: 1.5rem 0;
}

img,button {
  grid-row: 1/3;
}

span {
  grid-column: 2/3;
  grid-row: 2/3;
}

</style>