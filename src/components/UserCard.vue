<template>
  <div class="user-card"
    @click="toUserProfile(user.id)"
  >
    <div class="img-wrapper" ref="bgImgage">
      <img 
        :src="user.avatarUrl" alt="avatar"
        @error="setAltImg"
      >
    </div>

    <div class="info-wrapper">
      <div class="name">
        <h4>{{ user.name }}</h4>
        <p>@{{ user.alias }}</p>
      </div>
      <div class="count">
        <div class="posts">
          <svg class=""><use xlink:href="../assets/images/symbol-defs.svg#post-icon"></use></svg>
          <span>{{ user._count.posts }}</span>
        </div>
        <div class="likes">
          <svg class=""><use xlink:href="../assets/images/symbol-defs.svg#icon-heart-normal"></use></svg>
          <span>{{ totalPostLiked }}</span>
        </div>
      </div>
      <div class="follow">
        <span><b>{{ user._count.follow }} </b>追隨中</span>
        <span><b>{{ user._count.followed }} </b>跟隨者</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      defaultImgURL: `this.src=require('../assets/images/default_avatar1.png')`
    }
  },
  props: {
    user: {
      type: Object
    }
  },
  computed: {
    totalPostLiked(){
      return this.user.posts.reduce((prev, current)=> {
        return prev + (current.liked.length)
      }, 0)
    }
  },
  methods: {
    setAltImg(event){
      if (event.target.className === 'user-bg') {
        event.target.src = require('@/assets/images/default-profile-bg.jpg')
        return
      }
      event.target.src = require('@/assets/images/default_avatar1.png')
    },
    toUserProfile(userId) {
      this.$router.push({
        name: 'posts',
        params: { userId }
      })
    },
  },
  mounted(){
    const imageWrapper = this.$refs.bgImgage
    imageWrapper.style.backgroundImage = `url(${this.user.bgImageUrl})`

  }
}
</script>

<style lang="scss" scoped>

.user-card {
  width: 22rem;
  height: 30rem;
  border-radius: 15px;
  cursor: pointer;

  background-color: $color-gray-200;
}

.img-wrapper{
  width: 100%;
  height: 13rem;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 15px 15px 0 0;

  img {
    width: 10rem;
    height: 10rem;
    border: 4px solid $color-gray-100;
    position: absolute;
    left: 50%;
    top: 80%;
    transform: translate(-50%,-50%);
  }
}

.info-wrapper {
  margin-top: 2.5rem;
  height: 14rem;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.name {
  text-align: center;
}

.count {
  display: flex;
  justify-content: space-around;
  width: 70%;

  div {
    display: flex;
    align-items: center;

    span {
      padding-left: .5rem;
    }
  }

  svg {
    width: 2.4rem;
    height: 2.4rem;
  }
}

.follow {
  span {
    margin-right: .5rem;
    margin-left: .5rem;
  }
}


</style>