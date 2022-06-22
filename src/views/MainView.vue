<template>
  <div class="main-view">
    <NavBar/>
    <router-view></router-view>
    <PopUserList
      v-show="userRole === 'normal'"
    />
    <ActionModal/>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import ActionModal from '../components/ActionModal.vue'
import PopUserList from '../components/PopUserList.vue'

export default {
  name: 'MainView',
  data(){
    return {
      userRole: this.$store.state.userRole
    }
  },
  components: { NavBar, PopUserList, ActionModal },
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

.main-view {
  max-width: 1140px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 16% 60% 24%;

  div {
    padding: 0 .8rem;
  }

  @include respond($bp-tablet) {
    grid-template-columns: 10% 55% 35%;
  }

  @include respond($bp-mobile) {
    grid-template-columns: 100%;
  }
}

</style>