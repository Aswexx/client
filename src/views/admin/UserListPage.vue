<template >
	<div class="user-list">
		<PageInfoBar/>
		<div class="card-container">
			<UserCard/>
			<UserCard/>
			<UserCard/>
			<UserCard/>
			<UserCard/>
			<UserCard/>
			<UserCard/>
			<UserCard/>
			<UserCard/>
			<UserCard/>
			<UserCard/>
			<UserCard/>
		</div>
	</div>
</template>

<script>
import PageInfoBar from '../../components/PageInfoBar.vue'
import UserCard from '../../components/UserCard.vue'

export default {
	components: { PageInfoBar, UserCard }
}
</script>

<style lang="scss" scoped>
	.user-list {
		grid-column: 2/4;
		width: 100%;
	}

	.card-container {
		height: 90vh;
		overflow-y: scroll;

		display: grid;
		grid-template-columns: repeat(auto-fit, 22rem);
		grid-gap: 1rem;
	}
</style>
