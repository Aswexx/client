<template>
  <div id="app">
    <NavBar/>
    <router-view/>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
export default {
  components: {NavBar}
}
</script>

<style lang="scss">
@import './assets/scss/base.scss';

#app {
  max-width: 1140px;
  margin: 0 auto;
  border: 1px solid red;

  display: grid;
  grid-template-columns: 16% 60% 24%;

  @include respond($bp-mobile) {
    grid-template-columns: 100%
  }
}

</style>
