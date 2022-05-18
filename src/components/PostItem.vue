<template>
  <div class="post-item">
    <img src="./../assets/images/default-avatar2.jpg" alt="avatar">
    <div class="interact">
      <span>Apple</span>
      <span>@Mango ‧ 3小時</span>
    </div>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates harum repellat tempora dignissimos sit, perferendis amet soluta consectetur aut sed!</p>
    <div class="count">
      <a href="#">
        <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"></use></svg>
        <span>25</span>
      </a>
      <button>
        <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-heart-normal"></use></svg>
        <span>76</span>
      </button>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import './../assets/scss/base.scss';

  .post-item {
    height: 13.6rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid $color-gray-400;

    display: grid;
    grid-template-columns: min-content auto;
    grid-column-gap: 1rem;
  }

  .interact {
    span:first-child{
      font-weight: bold;
      padding-right: .5rem;
    }
  }

  .count {
    width: 12rem;
    display: flex;
    justify-content: space-between;

    span {
      padding-left: .5rem;
    }

    a , button{
      display: flex;
      align-items: center;
    }
  }

  img {
    grid-row: 1/4;
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  button {
    width: 4.2rem;
    padding: 0;
    background-color: transparent;
    color: $color-gray-700;
  }

</style>