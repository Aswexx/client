<template>
  <div class="container">
    <span>搜尋用戶</span>
    <div class="box">
      <input type="text" class="input" :class="{active: keyword.length}" v-model="keyword">
      <svg class="search" v-show="!keyword.length">
        <use xlink:href="./../assets/images/symbol-defs.svg#icon-search"></use>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data(){
    return {
      keyword: '',
    }
  },
  watch: {
    keyword(newVal){
      this.$emit('typing', newVal)
    }
  },
}
</script>

<style lang="scss" scoped>

.container {
  display: flex;
  align-items: center;

  span {
    flex-basis: 8rem;
    margin-right: 1rem;
  }
}

.box {
  position: relative;
  width: 80%;
  height: 4.5rem;
  &:hover {
    .search {
      display: none;
    }
  }
}

.input {
    padding: 1rem;
    width: 4.5rem;
    height: 4.5rem;
    background: none;
    border: 1px solid $color-brand;
    border-radius: 50px;
    box-sizing: border-box;
    font-size: 1.6rem;
    outline: none;
    transition: .5s;

  &:focus {
    &+svg {
      display: none;
    }
  }
}

.box:hover input, 
input:focus {
    width: 80%;
    border-radius: 10px;
}

.active {
  width: 8.75rem;
  border-radius: 10px;
}

.search {
  width: 2rem;
  height: 2rem;
  position: absolute;
  fill: $color-gray-500;
  top: 50%;
  left: 2.25rem;
  transform: translate(-50%,-50%);
}

</style>