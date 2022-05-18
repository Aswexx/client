<template>
  <div class="page-info">
    <!-- 顯示當前頁面，若查看他人頁面則顯示姓名與推文數 -->

    <!-- <h4>首頁</h4> -->
    <div class="personal">
      <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-arrow-left2"></use></svg>
      <h5>John Doe</h5>
      <p>23則貼文</p>
    </div>
  </div>
</template>

<script>
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
</style>