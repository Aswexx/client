<template>

	<div class="home">
		<pageInfoBar/>
		<div class="post-input-group">
			<img src="./../assets/images/default-avatar.jpg" alt="avatar" class="avatar">
			<textarea placeholder="有什麼新鮮事?"
        v-model="postContent"
      ></textarea>
      <div class="button-group">
        <span>
          {{validationErrMsg}}
        </span>
        <button>推文</button>
      </div>
		</div>
		<!-- PostItem 之後有資料串時 v-for -->
		<div class="postList">
			<PostItem/>
			<PostItem/>
			<PostItem/>
			<PostItem/>
			<PostItem/>
			<PostItem/>
			<PostItem/>
			<PostItem/>
		</div>
	</div>

</template>

<script>
import PageInfoBar from './../components/PageInfoBar.vue'
import PostItem from './../components/PostItem.vue'

export default {
  name:'HomePage',
	components: {PageInfoBar,PostItem},
  data(){
    return {
      postContent:'',
      validationErrMsg: '內容不可為空'
    }
  },
  watch: {
    postContent(newVal){
      if (newVal.length === 0){
        this.validationErrMsg = '內容不可為空'
      } else if (newVal.length > 10) {
        this.validationErrMsg = '字數不可超過 140 字'
      } else {
        this.validationErrMsg = ''
      }
    }
  },
}
</script>


<style lang="scss" scoped>
@import './../assets/scss/base.scss';

@include respond($bp-mobile) {
  .home {
    .post-input-group {
      display: none;
    }
  }
}

.postList {
  height: 71.5rem;
  overflow-y: scroll;
}

.post-input-group {
  height: 12.5rem;
  border-bottom: 5px solid $color-gray-400;
  padding-top: 1.5rem;
}


.button-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  button {
    width: 7.5rem;
    padding: 1rem 1.25rem;
    display: block;
    margin-left: 1rem;
  }
  span {
    color: $color-brand;
  }
}

textarea {
  font-size: 1.8rem;
  width: 70%;
  color: $color-gray-500;
  font-weight: bold;
  resize: none;
  overflow-y: hidden;
  padding-left: 1rem;
  border: none;
  outline: none;

  &:focus {
    color: $color-gray-900;
  }
}
</style>