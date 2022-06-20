<template>
	<div>
		<PageInfoBar/>
		<img class="user-bg" src="../assets/images/default-profile-bg.jpg" alt="user-bg">
		<div class="profile-card">
			<img src="../assets/images/default-avatar3.jpg" alt="img">
			<button @click="showEditModal">編輯個人資料</button>
			<div class="profile-info">
				<h5>John Doe</h5>
				<span>@heyjohn</span>
				<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore atque illum eos!</p>
				<div class="follows">
					<span>34 個跟隨中</span>
					<span>59 位追隨者</span>
				</div>
			</div>
		</div>

		<div class="profile-nav">
			<router-link to="/profile/posts" active-class="active">推文</router-link>
			<router-link to="/profile/replies" active-class="active">回覆</router-link>
			<router-link to="/profile/likes" active-class="active">喜歡的內容</router-link>
		</div>

		<router-view></router-view>
		<!-- PostItem 之後有資料串時 v-for -->
		<!-- <div class="post-list">
			<PostItem/>
			<PostItem/>
		</div> -->
	</div>
</template>

<script>
import PageInfoBar from '../components/PageInfoBar.vue'


export default {
	components: { PageInfoBar },
	methods: {
		showEditModal(){
			this.$bus.$emit('activateEditProfile','editProfile')
		}
	},
	mounted(){
		this.$router.push({ name: 'posts'})
	},
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/abstracts.scss';

	.user-bg {
		display: block;
		border-radius: 0;
		width: 100%;
		height: 20rem;

		object-fit: cover;
		object-position: 0 80%;
		// try: 預覽上傳圖，使用者可以調整裁切上傳區塊。
	}

	.profile-card {
		position: relative;
		margin-top: 1.6rem;
		img {
			vertical-align: middle;
			width: 14rem;
			height: 14rem;
			transform: translate(1.5rem , -8.6rem);
			border: 5px solid $color-gray-100;
		}
		button {
			position: absolute;
			right: 1.2rem;
			width: 13rem;
			background: $color-gray-100;
			color: $color-brand;
			border: 1px solid $color-brand;

			&:hover {
				background-color: $color-brand;
				color: $color-gray-100;
			}
		}
	}

	.profile-info {
		margin-top: -7.6rem;
		margin-bottom: 2rem;
		height: 10rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		span {
			color: $color-gray-400;
		}
		.follows {
			span {
				display: inline-block;
				margin-right: 2rem;
				color: $color-gray-900;
			}
		}
	}


	a {
		font-weight: bold;
		color: $color-gray-600;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		width: 13rem;
		padding-bottom: 1rem;
	}

	.active {
		color: $color-brand;
		border-bottom: 2px solid $color-brand;
	}
</style>