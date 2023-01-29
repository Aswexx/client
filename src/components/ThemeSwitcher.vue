<template>
  <SwitchButton
    :label="'light/dark'"
    :defaultVal="$store.state.useDarkTheme"
    @toggle="toggleDarkMode"
    ref="modeSwitcher"
  >
    <span class="mode-icon-wrapper">
      <svg v-if="isDarkMode" class="icon-moon">
        <use href="@/assets/images/symbol-defs.svg#icon-moon"></use>
      </svg>
      <svg v-else class="icon-sun">
        <use href="@/assets/images/symbol-defs.svg#icon-sun"></use>
      </svg>
    </span>

  </SwitchButton>
</template>

<script>
import SwitchButton from '@/components/SwitchButton.vue'
export default {
  name: 'ThemeSwitcher',
  components: { SwitchButton },
  computed: {
    isDarkMode() {
      return this.$store.state.useDarkTheme
    },
  },
    watch: {
    isDarkMode: {
      immediate: true,
      handler(newVal) {
        const body = document.querySelector('body')
        const modeSwitcher = this.$refs.modeSwitcher

        if (newVal) {
          body.classList.add('dark-mode')
          if (modeSwitcher) modeSwitcher.isTriggered = true
        } else {
          body.classList.remove('dark-mode')
          if (modeSwitcher) modeSwitcher.isTriggered = false
        }

        localStorage.setItem('preferDark', newVal)
      }
    },
  },
  methods: {
        toggleDarkMode(newState) {
      this.$store.state.useDarkTheme = newState
    },
  }
}
</script>

<style lang="scss" scoped>
.mode-icon-wrapper {
  display: flex;

  svg {
    width: 2rem;
    height: 2rem;
    margin: 0 .3rem;
    &.icon-moon {
      margin-right: auto;
    }

    &.icon-sun {
      margin-left: auto;
      fill: gold
    }
  }
}

</style>