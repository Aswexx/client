<template>
	<div class="setting-page">
		<PageInfoBar/>

		<form action="#" class="input-groups" id="setting" 
			@submit.prevent="saveSetting"
			ref="settingForm"
		>
			<InputItem :inputInfo="{
				inputTagId:'account',
				inputTagName:'account',
				type:'text',
				labelName:'帳號',
				originData: 'holahola',
				editable: false,
				placeholder: ''
			}"/>

			<InputItem :inputInfo="{
				inputTagId:'title',
				inputTagName:'title',
				type:'text',
				labelName:'名稱',
				originData: 'John Don',
				editable: true,
				placeholder: ''
			}"/>

			<InputItem :inputInfo="{
				inputTagId:'email',
				inputTagName:'email',
				type:'email',
				labelName:'Email',
				originData: 'qwdafheggr@gmail.com',
				editable: false,
				placeholder: ''
			}"/>

			<InputItem 
				:inputInfo="{
				inputTagId:'password',
				inputTagName:'password',
				type: 'password',
				labelName:'密碼',
				originData: '',
				editable: true,
				placeholder: '請設定密碼'
			}"/>

			<InputItem :inputInfo="{
				inputTagId:'checkPassword',
				inputTagName:'checkPassword',
				type: 'password',
				labelName:'密碼再確認',
				originData: '',
				editable: true,
				placeholder: '請再次設定密碼'
			}"/>

			<button type="submit" form="setting" :disabled="isPasswordSame">儲存</button>

		</form>
	</div>
</template>

<script>
import PageInfoBar from '../components/PageInfoBar.vue'
import InputItem from '../components/InputItem.vue'
export default {
	data(){
		return {
		}
	},
	components: { PageInfoBar, InputItem },
	methods: {
		saveSetting(event){
			// ! 先確認密碼一致
			// ! 補提交密碼變更
			console.log(event.target)
			const form = event.target
			const formData = new FormData(form)
			for (let [key,value] of formData.entries()){
				console.log(`${key}:${value}`)
			}
			if (formData.get('password') !== formData.get('checkPassword')){
				console.log(formData.get('password'))
				return alert('請再次確認密碼!')
			}
			form.submit()
		},
	},
}
</script>

<style lang="scss" scoped>

	

	.input-groups {
		margin-top: 1.5rem;
	}

	button {
		width: 9rem;
		margin-left: auto;
		display: block;
	}
</style>