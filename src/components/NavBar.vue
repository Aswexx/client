<template>
  <div class='nav'>
    <svg class="brand-logo">
      <use xlink:href="./../assets/images/symbol-defs.svg#icon-brand-logo"></use>
    </svg>

    <ul :class="{'admin-nav': isAdmin}">
      <li>
        <router-link
          :to="isAdmin ? '/post-list' : '/home'"
          active-class="active"
        >
          <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-home"></use></svg>
          <span>{{ isAdmin ? '推文清單' : '首頁' }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="isAdmin ? '/user-list' : '/profile'"
          active-class="active"
        >
          <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-user"></use></svg>
          <span>{{ isAdmin ? '使用者列表' : '個人資料' }}</span>
        </router-link>
      </li>
      <li>
        <router-link 
          v-if="!isAdmin"
          to="/setting" 
          active-class="active"
        >
          <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-setting"></use></svg><span>設定</span>
        </router-link>
      </li>
      <button 
        v-if="!isAdmin"
        @click="post">
        <span>推文</span>
        <svg class="post-icon" v-if="matchTablet"><use xlink:href="./../assets/images/symbol-defs.svg#post-icon"></use></svg>
      </button>
    </ul>

    <div class="logout"
      @click='logout'
    >
      <svg class="">
        <use xlink:href="./../assets/images/symbol-defs.svg#icon-logout"></use>
      </svg>
      <span>登出</span>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      matchTablet: window.matchMedia("(max-width: 768px)").matches,
      isAdmin: this.$store.state.userRole === 'admin'
    }
  },
  methods:{
    post(){
      this.$bus.$emit('activateModal','post')
    },
    logout(){
      if (this.isAdmin) {
        // ! TODO:清空驗證
        return this.$router.push({ name: 'admin-login'})
      }
      // ! TODO:清空驗證
      this.$router.push({ name: 'login'})
      // window.location.reload()
      this.$store.commit("RESETSTATES")
    }
  },
  mounted(){
    window.addEventListener('resize',()=>{
      this.matchTablet = window.matchMedia("(max-width: 768px)").matches
      this.$store.commit("CHANGEVIEWPORT", window.innerWidth)
    })
  }
}
</script>

<style lang="scss" scoped>
@import "./../assets/scss/abstracts.scss";

  .active {
    color: $color-brand;
    fill: $color-brand;

    transition: all .3s ease-in;
  }

  div.nav {
    height: 98vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    .brand-logo {
      align-self: flex-start;
    }

    ul.admin-nav {
      height: 15rem;
      margin-top: 1rem;
    }
    
    @include respond($bp-tablet){
      .brand-logo {
        align-self: center;
      }
    }

    @include respond($bp-mobile){
      height: 5.5rem;
      .brand-logo,.logout {
        display: none;
      }

      border-top: 1px solid $color-gray-200;
      background-color: blue;

      position: fixed;
      width: 100%;
      bottom: 0;
    }
  }

  ul {
    height: 24.4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    @include respond($bp-tablet){
      align-items: center;
    }

    @include respond($bp-mobile){
      flex-direction: row;
      width: 100%;
      button {
        background-color: white;
      }
    }
  }

  .logout {
    margin-top: auto;
    cursor: pointer;
  }

  li>a,.logout {
    display: flex;
    align-items: center;
  }

  a {
    text-decoration: none;
    color: $color-gray-900;
  }

  svg {
    width: 2.4rem;
    height: 2.4rem;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    

    &.brand-logo {
      width: 5rem;
      height: 5rem;
    }
    &.post-icon {
      fill: $color-gray-100;
    }
  }

  @include respond($bp-tablet) {
    span {
      display: none;
    }
    button {
      width: 4rem;
      height: 4rem;
      padding: 0;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    svg.post-icon{
      margin: 0;
      fill: $color-gray-100;
    }
  }

  @include respond($bp-mobile) {
    svg.post-icon {
      fill: $color-gray-900;
    }
  }

</style>