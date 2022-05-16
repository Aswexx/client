<template>
  <div class='nav'>
    <svg class="brand-logo">
      <use xlink:href="./../assets/images/symbol-defs.svg#icon-brand-logo"></use>
    </svg>
    <ul>
      <li>
        <a href="#">
          <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-home"></use></svg><span>首頁</span>
        </a>
      </li>
      <li>
        <a href="#">
          <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-user"></use></svg><span>個人資料</span>
        </a>
      </li>
      <li>
        <a href="#">
          <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-setting"></use></svg><span>設定</span>
        </a>
      </li>
    <button>
      <span>推文</span>
      <svg class="post-icon" v-if="matchTablet"><use xlink:href="./../assets/images/symbol-defs.svg#post-icon"></use></svg>
    </button>
    </ul>
    <div class="logout">
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
      matchTablet: window.matchMedia("(max-width: 768px)").matches
    }
  },
  mounted(){
    window.addEventListener('resize',()=>{
      this.matchTablet = window.matchMedia("(max-width: 768px)").matches
    })
  }
}
</script>

<style lang="scss" scoped>
@import "./../assets/scss/abstracts.scss";

  div.nav {
    height: 98vh;
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    
    @include respond($bp-tablet){
      align-items: center;
      height: 60vh;
    }

    @include respond($bp-mobile){
      height: 5.5rem;
      .brand-logo,.logout {
        display: none;
      }
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
  }

  li>a,.logout {
    display: flex;
    align-items: center;
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