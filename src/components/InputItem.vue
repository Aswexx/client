<template>
	<div class="input-item">
		<label :for="inputInfo.inputTagId">{{inputInfo.labelName}}</label>

		<input
			v-if="inputInfo.editable"
			:id="inputInfo.inputTagId"
			:type="inputInfo.type"
			:name="inputInfo.inputTagName"
			v-model="typing"
		>

		<input
			v-else
			disabled
			:id="inputInfo.inputTagId" 
			:type="inputInfo.type" 
			:value="inputInfo.originData" 
			:placeholder="inputInfo.placeholder"
		>

	</div>
</template>

<script>
export default {
	data(){
		return {
			typing:'',
		}
	},
	props: {
		inputInfo: {
			type: Object
		},
	},
	mounted(){
		this.typing = this.inputInfo.originData
	}
}
</script>

<style lang="scss" scoped>

	.input-item {
		display: flex;
		flex-direction: column;

		&>* {
			background-color: $color-gray-200;
		}
	}

	label {
		padding-bottom: .7rem;
		font-size: 1.4rem;
	}

	input {
		border: none;
		outline: none;
		border-bottom: 1px solid $color-gray-600;
		padding-bottom: .3rem;
		margin-bottom: 2rem;
		font-size: 1.6rem;
	}

</style>