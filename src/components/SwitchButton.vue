<template>
  <label class="switch" for="toggle">
    <input type="checkbox" id="toggle" 
      v-model="isTriggered"
      @click="toggle"
    />
    <span class="slider"></span>
  </label>
</template>

<script>
export default {
  data() {
    return {
      isTriggered: this.defaultVal
    }
  },
  props: ['defaultVal'],
  methods: {
    toggle() {
      this.isTriggered = !this.isTriggered
      this.$emit('toggle', this.isTriggered)
    }
  }
}
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  width: 5rem;
  height: 2.4rem;

  input {
    display: none;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-gray-400;
  transition: 0.4s;
  border-radius: 2rem;
}

.slider:before {
  position: absolute;
  content: '';
  height: 2rem;
  width: 2rem;
  left: 2px;
  top: 2px;
  background-color: $color-gray-100;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: $color-brand;
}

input:checked + .slider:before {
  transform: translateX(2.6rem);
}



  
</style>