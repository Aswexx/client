<template>
  <div class="input-wraper">
    <label :for="forAttr">{{ labelName }}</label>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HollowInput',
  props: ['labelName', 'forAttr']
}
</script>

<style lang="scss" scoped>
.input-wraper {
  position: relative;
}

label {
  position: absolute;
  top: -1.2rem;
  left: 3rem;
  padding: 0 1rem;
  background-color: $color-gray-100;
  color: $color-brand;
  font-weight: bold;
  font-size: 1.4rem;
}

input {
  height: 4rem;
  width: 100%;
  border: 1px solid $color-brand;
  border-radius: 2rem;
  padding-left: 1.5rem;
  color: $color-gray-800;

  &:focus {
    outline: 1px solid $color-brand;
  }
}

input:focus {
  outline: none;
}

</style>