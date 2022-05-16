<template>
  <div id="app">
    <NavBar/>
  </div>
</template>

<script>
import NavBar from './components/NavBar'
export default {
  name: 'App',
  components: {NavBar}
}
</script>

<style lang="scss">
@import "./assets/scss/base.scss";

// 178 px / 639 px / 273 px
// 16 % / 60 % / 24 %

#app {
  max-width: 1140px;
  margin: 0 auto;
  border: 1px solid red;

  display: grid;
  grid-template-columns: 16% 60% 24%;

  @include respond($bp-mobile){
    grid-template-columns: 100%
  }
}

</style>
