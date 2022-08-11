<template>
  <div class="page-info">
    <!-- 顯示當前頁面，若查看他人頁面則顯示姓名與推文數 -->

    <!-- <h4>首頁</h4> -->
    <div class="setting"
      v-if="isAdmin"
    >
      <h3>{{ pageTitle }}</h3>
    </div>

    <div class="personal"
      v-else-if="$route.name !== 'setting' && !matchMobile"
    >
      <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-arrow-left2"></use></svg>
      <h5>{{ this.$store.state.userData.name }}</h5>
      <p>@ {{ this.$store.state.userData.alias }}</p>
    </div>

    <div class="personal-mobile-view"
      v-else-if="$route.name !== 'setting' && matchMobile"
    >
      <img src="../assets/images/default-avatar.jpg" alt="img">
      <h2>test</h2>
    </div>

    <div class="setting"
      v-else
    >
      <h3>帳戶設定</h3>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      viewport: this.$store.state.viewport,
      isAdmin: this.$store.state.userRole === 'admin',
      currentPage: this.$route.name
    }
  },
  computed: {
    matchMobile(){
      return this.viewport <= 576
    },
    pageTitle(){
      if (this.currentPage === 'post-list'){
        return '推文清單'
      }
      return '使用者列表'
    }
  },
  methods: {
    updateViewport(){
      this.viewport = this.$store.state.viewport
    }
  },
  mounted(){
    window.addEventListener('resize', this.updateViewport)
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.updateViewport)
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

  div.page-info {
    border-bottom: 1px solid $color-gray-400;
    padding: 1rem 1rem 1rem 0rem;
  }

  svg {
    width: 1.7rem;
    height: 1.4rem;
  }


  .personal {
    display: grid;
    grid-template-columns: repeat(2,max-content);
    grid-column-gap: 1.5rem;

    svg {
      grid-row: 1/3;
      align-self: center;
    }
  }

  .personal-mobile-view {
    display: flex;
    img {
      margin-right: 2rem;
    }
  }

  .setting {
    h3 {
      height: 4rem;
    }
  }
</style>