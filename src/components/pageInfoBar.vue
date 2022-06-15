<template>
  <div class="page-info">
    <!-- 顯示當前頁面，若查看他人頁面則顯示姓名與推文數 -->

    <!-- <h4>首頁</h4> -->
    <div class="personal"
      v-if="$route.name !== 'setting' && !matchMobile"
    >
      <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-arrow-left2"></use></svg>
      <h5>John Doe</h5>
      <p>23則貼文</p>
    </div>

    <div class="personal-mobile-view"
      v-else-if="$route.name !== 'setting' && matchMobile"
    >
      <h3>test</h3>
    
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
      matchMobile: window.matchMedia("(max-width: 576px)").matches
    }
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

  .setting {
    h3 {
      height: 4rem;
    }
  }
</style>