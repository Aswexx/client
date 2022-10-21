<template>
  <div class="main-view">
    <NavBar />

    <transition name="fade" mode="out-in">
      <router-view class="main-contents"></router-view>
    </transition>

    <PopUserList v-show="userRole === 'normal'" />

    <ActionModal />
    <transition name="fade-scale">
      <ChatRoom v-if="this.$store.state.isChatActivated" />
    </transition>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import ActionModal from '../components/ActionModal.vue'
import PopUserList from '../components/PopUserList.vue'
import ChatRoom from '../components/ChatRoom.vue'

export default {
  name: 'MainView',
  data() {
    return {
      userRole: this.$store.state.userAbout.userRole,
    }
  },
  components: { NavBar, PopUserList, ActionModal, ChatRoom },
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
    padding: 0 0.8rem;
  }

  @include respond($bp-tablet) {
    grid-template-columns: 10% 55% 35%;
  }

  @include respond($bp-mobile) {
    grid-template-columns: 100%;
  }
}

.main-contents {
  border: 1px solid blue;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}


.fade-scale-enter-active {
  transition: all 0.2s ease-in-out;
}

.fade-scale-leave-active {
  transition: all 0.2s ease-in-out 0.3s;
}

.fade-scale-enter,
.fade-scale-leave-to {
  opacity: 0;
  transform-origin: top left;
  transform: scale(0);
}

.fade-scale-enter-to,
.fade-scale-leave {
  opacity: 1;
  transform-origin: top left;
  transform: scale(1);
}

</style>