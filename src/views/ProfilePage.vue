<template>
	<div>
		<PageInfoBar/>
		<img class="user-bg" src="../assets/images/default-profile-bg.jpg" alt="user-bg">
		<div class="profile-card">
			<img src="../assets/images/default-avatar3.jpg" alt="img">

			<div class="interact">
				<button 
					v-show="!isSelf"
					@click="email"
				>
				<svg class=""><use xlink:href="../assets/images/symbol-defs.svg#icon-email"></use></svg>
				</button>
				<button 
					v-show="!isSelf"
					:class="{followed: isfollowed}"
					@click="toggleFollow"
				>
					<svg v-if="!isfollowed"><use xlink:href="../assets/images/symbol-defs.svg#icon-bell"></use></svg>
					<svg v-else><use xlink:href="../assets/images/symbol-defs.svg#icon-followed"></use></svg>
				</button>
				<button :class="{end: isSelf}" @click="showEditModal">編輯個人資料</button>
			</div>

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
	data(){
		return {
			isSelf: false,
			isfollowed: true
		}
	},
	components: { PageInfoBar },
	methods: {
		showEditModal(){
			this.$bus.$emit('activateModal','editProfile')
		},
		toggleFollow(){
			// !TODO update user following
			this.isfollowed = !this.isfollowed
		},
		email(){
			window.location.href = "mailto:a284ru8ccc@gmail.com?subject=你好啊&body=yoyoyo%0Ahey~~&cc=anita888@gmail.com";
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
	}

	.interact {
		width: 50%;
		border: 1px solid blue;
		position: absolute;
		top: 0;
		right: 1.2rem;
		display: flex;
		justify-content: space-between;

		button {
			width: 4rem;
			height: 4rem;
			padding: 0;
			background: $color-gray-100;
			color: $color-brand;
			border: 1px solid $color-brand;

			&:last-child {
				width: 13rem;
			}

			&:hover {
				background-color: $color-brand;
				color: $color-gray-100;

				svg {
					fill: $color-gray-100;
				}
			}

			&.end {
				margin-left: auto;
			}
			&.followed {
				background-color: $color-brand;
				svg {
					fill: $color-gray-100;
				}
			}
		}


		svg {
			width: 2.4rem;
			height: 2.4rem;
			fill: $color-brand;
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