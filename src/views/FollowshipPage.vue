<template>
  <div class="search">
    <PopUserList class="user-list"></PopUserList>
  </div>
</template>

<script>
import PopUserList from './../components/PopUserList.vue'

export default {
  name: 'FollowshipPage',
  components: { PopUserList },
  computed: {
    isOnMobile(){
      return this.$store.state.viewport < 576
    }
  },
  watch: {
    isOnMobile(newVal){
      if (!newVal) {
        this.$router.push({name: 'home'})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list {
  @include respond($bp-mobile) {
    display: initial;
  }
}
</style>