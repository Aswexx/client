<template>
  <div class="toast-container">
    <div
      class="toast"
      :class="{
        active: isTriggered,
        success: toastType === 'success',
        info: toastType === 'info',
        error: toastType === 'error'
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
            v-else-if="toastType === 'info'"
            href="./../assets/images/symbol-defs.svg#icon-info"
          ></use>

          <use
            v-else-if="toastType === 'error'"
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

    </div>
  </div>
</template>

<script>
export default {
  methods: {
    close() {
      console.log(window.timer)
      clearTimeout(window.timer)
      this.$refs.toast.classList.remove('active')
    }
  },
  computed: {
    isTriggered() {
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
          return '操作成功!'
        case 'info':
          return '通知'
        case 'error':
          return 'OOPS!'
        case 'warning':
          return '提醒'
      }
      return ''
    }
  },
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
  top: 10%;
  right: 50%;
  overflow: hidden;

  @include respond($bp-mobile){
    width: 100%;
    top: 80%;
    right: 0;
  }
}

.toast {
  background-color: $color-gray-100;
  border-radius: 1.2rem;
  padding: 2rem 3rem 2rem 3rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  border: 0.5rem solid $color-success;
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
  border: 0.5rem solid $color-success;
  svg.toast__icon--main {
    background-color: $color-success;
  }
}

.toast.info {
  border: 0.5rem solid $color-sup-blue;
  svg.toast__icon--main {
    background-color: $color-sup-blue;
  }
}

.toast.error {
  border: 0.5rem solid $color-error;
  svg.toast__icon--main {
    background-color: $color-error;
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


.toast.active {
  transform: translateY(0%);
}

</style>