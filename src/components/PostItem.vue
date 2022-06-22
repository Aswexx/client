<template>
  <div class="post-item">
    <img src="./../assets/images/default-avatar2.jpg" alt="avatar">
    <div class="interact">
      <span><b>Apple</b>@Mango ‧ 3小時</span>
      <slot></slot>
    </div>
    <span>回覆 @apple</span>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates harum repellat tempora dignissimos sit, perferendis amet soluta consectetur aut sed!</p>
    <div class="count" v-show="currentAppliedPath === 'likes' || currentAppliedPath === 'posts'">
      <button href="#"
        @click="reply"
      >
        <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"></use></svg>
        <span>25</span>
      </button>
      <button>
        <svg 
          v-if="currentAppliedPath === 'posts'"
        >
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-heart-normal"></use>
        </svg>
        <svg class="heart-icon" 
          v-else
        >
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-heart-solid"></use>
        </svg>
        <span>76</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      currentAppliedPath: this.$route.name
    }
  },
  methods:{
    reply(){
      this.$bus.$emit('activateModal','reply')
    }
  },
  mounted(){
    
  }
}
</script>

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
    display: flex;
    justify-content: space-between;
    b {
      padding-right: 1rem;
    }
  }

  .count {
    width: 12rem;
    display: flex;
    justify-content: space-between;
    grid-column: 2/-1;

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

  a {
    text-decoration: none;
    color: $color-gray-900;
  }

  .heart-icon {
    fill: crimson;
  }


</style>