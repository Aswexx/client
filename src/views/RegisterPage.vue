<template>
	<div class="register">

		<svg class="brand-logo">
      <use xlink:href="./../assets/images/symbol-defs.svg#icon-brand-logo"></use>
    </svg>
		<h3>建立你的帳號</h3>

		<form action="">
			<label for="account">帳號</label>
			<input id="account" type="text" placeholder="請輸入帳號">
			<label for="account">名稱</label>
			<input id="account" type="text" placeholder="請輸入使用者名稱">
			<label for="account">Email</label>
			<input id="account" type="text" placeholder="請輸入Email">
			<label for="account">密碼</label>
			<input id="account" type="password" placeholder="請設定密碼">
			<label for="password">確認密碼</label>
			<input id="password" type="password" placeholder="請再次密碼">
		</form>
		<button>註冊</button>
		<router-link 
			to="/login"
		>取消</router-link>

	</div>

</template>

<style lang="scss" scoped>
@import "./../assets/scss/abstracts.scss";

	.register {
		margin: 6rem auto auto auto;
		width: 36rem;
		height: 60rem;

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