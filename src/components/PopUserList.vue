<template>

	<div class="pop-user-list">
		<h4>追隨誰</h4>
		<div class="user-card-wraper">

			<div class="user-card" v-for="user in users" :key="user.id">
				<img :src="user.src" alt="avatar">
				<h5>{{user.name}}</h5>
				<button :class="{'not-follow': !user.isFollowing}" @click="toggleStyle(user)">
					{{user.isFollowing ? '正在追隨' : '追隨'}}
				</button>
				<span>@{{user.location}}</span>
			</div>

		</div>
	</div>
</template>

<script>
// eslint-disable-next-line
const dummyUser = [
	{
		id:'001',
		name: 'Tim Millo',
		location: 'San Antonio',
		src: require('./../assets/images/default-avatar3.jpg'),
		isFollowing: true
	},
	{
		id:'002',
		name: 'James Bay',
		location: 'DC',
		src: require('./../assets/images/default-avatar3.jpg'),
		isFollowing: true
	},
	{
		id:'003',
		name: 'Robert Mitch',
		location: 'Canada',
		src: require('./../assets/images/default-avatar3.jpg'),
		isFollowing: false
	}
]

export default {
	name: 'PopUserList',
	data(){
		return {
			users: []
		}
	},
	methods:{
		toggleStyle(user){
			user.isFollowing = !user.isFollowing
		}
	},
	mounted(){
		this.users = dummyUser
	}
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/abstracts.scss';

.pop-user-list {
	@include respond($bp-mobile) {
		display: none;
	}
}



.not-follow {
	background-color: $color-gray-100;
	color: $color-brand;
	border: 1px solid $color-brand;
	width: 6.4rem;
	justify-self: end;


	&:hover {
		color: $color-gray-100;
	}
}

button {
	padding: 1.2rem;

	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

}

.user-card {
	padding: 1rem 0;
	display: grid;
	grid-template-columns: min-content 1fr 1fr;
	grid-column-gap: .5rem;

	align-items: center;
}

h5 {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

h4 {
	height: 6.1rem;
	border-bottom: 1px solid $color-gray-400;
	padding: 1.5rem 0;
}

img,button {
	grid-row: 1/3;
}

span {
	grid-column: 2/3;
	grid-row: 2/3;
}

	
</style>