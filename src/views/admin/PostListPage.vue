<template>
	<div class="post-list">
		<PageInfoBar/>
		<PostItem>
			<svg class="cross" @click="removePost"><use xlink:href="./../../assets/images/symbol-defs.svg#icon-cross"></use></svg>
		</PostItem>
	</div>
</template>

<script>
import PageInfoBar from '../../components/PageInfoBar.vue'
import PostItem from '../../components/PostItem.vue'
export default {
	components: { PageInfoBar, PostItem },
	methods: {
		removePost(){
			alert('22')
		}
	}
}
</script>

<style lang="scss" scoped>

	.post-list {
		grid-column: 2/4;
		width: 90%;
	}

	.post-item {
		grid-template-rows: 3.5rem;
		height: 9rem;
		

		.cross {
			cursor: pointer;
		}
	}

</style>