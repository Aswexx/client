<template>
	<div>
		<h2>Hi</h2>
	</div>
</template>

<script>
export default {
	
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/base.scss';

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