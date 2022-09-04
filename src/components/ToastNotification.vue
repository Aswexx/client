<template>
  <div class="toast-container">
    <div
      class="toast"
      :class="{
        active: isTriggered,
        success: toastType === 'success',
        info: toastType === 'info'
      }"
      ref="toast"
    >
      <div class="toast__content">
        <svg class="toast__icon--main">
          <use
            v-if="toastType === 'success'"
            href="./../assets/images/symbol-defs.svg#icon-check"
          ></use>
          <use
            v-else
            href="./../assets/images/symbol-defs.svg#icon-cross"
          ></use>
        </svg>

        <div class="toast__message">
          <span class="toast__message--title">{{ toastTitle }}</span>
          <span class="toast__message--detail">{{ detail }}</span>
        </div>

        <svg class="toast__icon--close" @click="close">
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use>
        </svg>
      </div>

      <div ref="progress" class="toast__progress"></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    close() {
      clearTimeout(window.timer)
      this.$refs.toast.classList.remove('active')
    }
  },
  computed: {
    isTriggered() {
      // return this.$store.commit('TOGGLE_TOAST', {type: 'success', detail: 'good'})
      return this.$store.state.isToastShow
    },
    toastType() {
      return this.$store.state.toastType
    },
    detail() {
      return this.$store.state.toastDetail
    },
    toastTitle() {
      switch (this.toastType) {
        case 'success':
          return 'Success'
        case 'info':
          return 'Info'
        case 'error':
          return 'Error'
        case 'warning':
          return 'Warning'
      }
      return ''
    }
  },
  watch: {
    isTriggered() {
      this.$refs.progress.classList.add('active')
      setTimeout(() => {
        this.$refs.progress.classList.remove('active')
      }, 6000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';
svg {
  display: block;
  margin-right: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  fill: $color-gray-100;

  border-radius: 50%;
  padding: 0.4rem;
}

.toast-container {
  position: absolute;
  top: 30;
  right: 0;
  overflow: hidden;
}

.toast {
  border-radius: 1.2rem;
  padding: 2rem 3rem 2rem 3rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  border-left: 0.5rem solid $color-success;
  overflow: hidden;
  transform: translateY(calc(100% + 1rem));
  transition: all 0.5s ease-in;

  &__icon--close {
    position: absolute;
    top: 0;
    right: 0;

    width: 2rem;
    height: 2rem;
    fill: $color-gray-500;
    background-color: $color-gray-100;
    cursor: pointer;

    &:hover {
      fill: $color-gray-900;
    }
  }
}

.toast.success {
  border-left: 0.5rem solid $color-success;
  svg.toast__icon--main {
    background-color: $color-success;
  }
  .toast__progress {
    &:before {
      background-color: $color-success;
    }
  }
}

.toast.info {
  border-left: 0.5rem solid $color-sup-blue;
  svg.toast__icon--main {
    background-color: $color-sup-blue;
  }
  .toast__progress {
    &:before {
      background-color: $color-sup-blue;
    }
  }
}

.toast__content {
  display: flex;
  align-items: center;
}

.toast__message {
  display: flex;
  flex-direction: column;

  &--title {
    font-size: 2rem;
    font-weight: bolder;
    color: $color-gray-900;
  }

  &--detail {
    font-size: 1.4rem;
    color: $color-gray-700;
  }
}

.toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0.3rem;
  width: 100%;
  background-color: $color-gray-100;

  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0%; // progerss controls
    width: 100%;
    height: 100%;
    background-color: $color-success;
  }
}

.toast.active {
  transform: translateY(0%);
}

.toast__progress.active {
  &:before {
    animation: progress 5s linear forwards;
  }
}

@keyframes progress {
  100% {
    right: 100%;
  }
}
</style>