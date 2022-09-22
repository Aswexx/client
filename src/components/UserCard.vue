<template>
	<div class="user-card">
		<div class="img-wrapper">
			<img src="../assets/images/default-avatar.jpg" alt="bg">
		</div>

		<div class="info-wrapper">
			<div class="name">
				<h4>John Doe</h4>
				<p>@heyjohn</p>
			</div>
			<div class="count">
				<div class="posts">
					<svg class=""><use xlink:href="../assets/images/symbol-defs.svg#post-icon"></use></svg>
					<span>1.5k</span>
				</div>
				<div class="likes">
					<svg class=""><use xlink:href="../assets/images/symbol-defs.svg#icon-heart-normal"></use></svg>
					<span>20k</span>
				</div>
			</div>
			<div class="follow">
				<span><b>34個</b>追隨中</span>
				<span><b>59位</b>跟隨者</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>

.user-card {
	width: 22rem;
	height: 30rem;
	border-radius: 15px;

	background-color: $color-gray-200;
}

.img-wrapper{
	width: 100%;
	height: 13rem;
	background-image: url('../assets/images/default-profile-bg.jpg');
	background-size: cover;
	background-position: center;
	position: relative;
	border-radius: 15px 15px 0 0;

	img {
		width: 10rem;
		height: 10rem;
		border: 4px solid $color-gray-100;
		position: absolute;
		left: 50%;
		top: 80%;
		transform: translate(-50%,-50%);
	}
}

.info-wrapper {
	margin-top: 2.5rem;
	height: 14rem;

	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}

.name {
	text-align: center;
}

.count {
	display: flex;
	justify-content: space-around;
	width: 70%;

	div {
		display: flex;
		align-items: center;

		span {
			padding-left: .5rem;
		}
	}

	svg {
		width: 2.4rem;
		height: 2.4rem;
	}
}

.follow {
	span {
		margin-right: .5rem;
		margin-left: .5rem;
	}
}


</style>