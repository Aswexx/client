<template>
	<div class="user-login">
		<svg class="brand-logo">
      <use xlink:href="./../assets/images/symbol-defs.svg#icon-brand-logo"></use>
    </svg>
		<h3>登入 Alphitter</h3>
		<form action="">
			<label for="account">帳號</label>
			<input id="account" type="text" placeholder="請輸入帳號">
			<label for="password">密碼</label>
			<input id="password" type="text" placeholder="請輸入密碼">
		</form>
		<button>登入</button>
		<div class="other">
			<a href="">註冊</a>
			<span>·</span>
			<a href="">後台登入</a>
		</div>

	</div>
</template>

<style lang="scss" scoped>
@import "./../assets/scss/abstracts.scss";

	.user-login {
		margin: 6rem auto auto auto;
		width: 36rem;
		height: 42rem;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	svg {
		width: 5rem;
		height: 5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		width: 100%;

		& > * {
			background-color: $color-gray-200;
			padding-left: 1rem;
		}
	}

	label {
		padding-bottom: .7rem;
		font-size: 1.4rem;
	}


	input {
		border: none;
		outline: none;
		border-bottom: 1px solid $color-gray-800;
		padding-bottom: .3rem;
		margin-bottom: 2rem;
		font-size: 1.6rem;
	}

	.other {
		padding: .7rem;
		width: 50%;
		margin-left: auto;
		text-align: end;

		span {
			padding-left: 1rem;
			padding-right: 1rem;
		}
	}

	button {
		margin-top: -1rem;
	}

</style>