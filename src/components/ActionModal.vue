<template>
<transition name="modal-fade">

	<div class="modal"
		v-show="isActivated"
	>
    <transition name="modal-inner-offset">
		<div class="post-input-group"
			v-show="modalType === 'post' || modalType === 'reply'"
			:class="{reply: modalType === 'reply'}"
			@click="focusInput()"
		>
			<div class="post-input-title">
				<svg 
          v-if="$store.state.viewport < 576"
          @click="closeModal()"
        >
          <use xlink:href="../assets/images/symbol-defs.svg#icon-arrow-left2"></use>
        </svg>

        <svg 
          v-else
          @click="closeModal()"
        >
          <use xlink:href="../assets/images/symbol-defs.svg#icon-cross"></use>
        </svg>

        <div class="button-group"
          v-show="$store.state.viewport < 576"
        >
          <button 
            @click="submitPost()"
            :disabled="postContent.length === 0 || postContent.length > 140"
          >推文</button>
        </div>

			</div>

			<div class="source-post"
				v-show="modalType === 'reply'"
			>
				<img src="./../assets/images/default-avatar2.jpg" alt="avatar">
				<div class="interact">
					<span>Apple</span>
					<span>@Mango ‧ 3小時</span>
				</div>
				<p class="text-content">Lorem, ipsem illusint laboriosam, quod atque neque odio quos ut optio eveniet nesciunt obcaecati modi consequuntur perferendis unde a cum at iusto voluptas. Dolore iste repudiandae quasi quisquam sit deleniti cum nam placeat aspernatur laudantium praesentium odio error quos officiis aut magni animi enim quis fugit, tenetur explicabo. Quia aliquid magnam quasi facilis odio, incidunt reprehenderit possimus repellat officia porro sapiente, dicta labore impedit, inventore ullam debitis commodi vel harum aspernatur enim id consequuntur blanditiis. Unde ipsa non eius, repellendus animi voluptatibus vero aut porro cum fugiat ea quas quia dolor quibusdam expedita sint, ex blanditiis magnam doloribus aliquam sit deleniti facere tempore provident! Soluta magnam adipisci iusto itaque ex distinctio molestias voluptates? Placeat cupiditate sequi corrupti!</p>
				<p>回覆給<span>@apple</span></p>
			</div>

      <div class="textarea-group">
        <img src="./../assets/images/default-avatar.jpg" alt="avatar" class="avatar">
        <textarea placeholder="有什麼新鮮事?"
          v-model="postContent"
          ref="txtarea"
        >
        </textarea>
      </div>

			<div class="button-group"
        v-show="$store.state.viewport >= 576"
      >
				<span>
					{{validationErrMsg}}
				</span>
				<button 
					@click="submitPost()"
					:disabled="postContent.length === 0 || postContent.length > 140"
				>推文</button>
			</div>

      <p class="validation-err-msg" v-show="$store.state.viewport < 576">
        {{validationErrMsg}}
      </p>

		</div>
    </transition>


    <transition name="modal-inner-offset">
		<div class="profile-card"
			v-show="modalType === 'editProfile'"
		>
			<div class="title">
				<span>
					<svg @click="closeModal()"><use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use></svg>
				</span>
				<span class="title-text">編輯個人資料</span>
				<span class="validation-error"
					v-show="editNameContent.length > 20 || editIntroContent.length > 160"
				>
					編輯字數不符限制
				</span>
				<button 
					:disabled="editNameContent.length > 20 || editIntroContent.length > 160"
					@click="saveProfile"
				>
				儲存</button>
			</div>

			<div class="bg-wraper">
				<svg>
					<use xlink:href="./../assets/images/symbol-defs.svg#icon-camera"></use>
				</svg>
				<svg>
					<use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use>
				</svg>
			</div>

			<div class="avatar-wraper">
				<svg>
					<use xlink:href="./../assets/images/symbol-defs.svg#icon-camera"></use>
				</svg>
			</div>

			<div class="profile-input-group">
				<label for="profile-name">名稱</label>
				<input type="text" name="" id="profile-name"
					v-model="editNameContent"
				>
				<span>{{ editNameContent.length }}/20</span>
				<label for="profile-intro">自我介紹</label>
				<textarea name="" id="profile-intro"
					v-model="editIntroContent"
				></textarea>
				<span>{{ editIntroContent.length }}/160</span>
			</div>

		</div>
    </transition>

  </div>

</transition>
</template>

<script>
export default {
	data(){
		return {
			modalType: '',
			postContent: '',
			validationErrMsg: '',
			replyContent: '',
			validationReplyErrMsg: '',
			editNameContent:'',
			editIntroContent: '',
			isActivated: '',
		}
	},
	watch: {
    postContent(newVal){
      if (!newVal.length){
        this.validationErrMsg = '內容不可為空'
      } else if (newVal.length > 10) {
        this.validationErrMsg = '字數不可超過 140 字'
      } else {
        this.validationErrMsg = ''
      }
    },
    replyContent(newVal){
      if (!newVal.length){
        this.validationReplyErrMsg = '內容不可為空'
      } else if (newVal.length > 140) {
        this.validationReplyErrMsg = '字數不可超過 140 字'
      } else {
        this.validationReplyErrMsg = ''
      }
    }
  },
	methods: {
		saveProfile(){
			alert('hi')
		},
		setModalType(type){
			this.isActivated = true
			this.modalType = type
		},
		closeModal(){
      this.modalType = ''
			this.isActivated = false
		},
		focusInput(){
      this.$refs.txtarea.focus()
    },
	},
	mounted(){
		this.$bus.$on('activateModal', this.setModalType)
	},
	beforeDestroy(){
		this.$bus.$off('activateModal', this.setModalType)
	}
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

.modal {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba($color: $color-gray-700, $alpha: .5);

  @include respond($bp-mobile) {
    background-color: $color-gray-100;
  }
}

.post-input-group, .profile-card {
  width: 50%;
  height: 30rem;
  margin: 5rem auto auto auto;

  background-color: $color-gray-100;
  border: 1px solid $color-gray-400;
  border-radius: 15px;

  .post-input-title {
    border-bottom: 1px solid $color-gray-500;
    padding: 1rem;
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
    fill: $color-brand;
    cursor: pointer;

    @include respond($bp-mobile) {
      fill: $color-gray-900;
    }
  }

  img {
    margin-top: 1.5rem;
    margin-left: 1rem;
  }

  @include respond($bp-mobile) {
    width: 100%;
    height: 100%;
    margin: 0;
    border: none;
    border-radius: 0;

    display: flex;
    flex-direction: column;

    .post-input-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .textarea-group {
      display: flex;
      margin-bottom: auto;
      img {
        align-self: flex-start;
      }
      textarea {
        height: 30rem;
        padding-top: 1rem;
      }
    }

    .validation-err-msg {
      text-align: end;
      color: $color-error;
      padding-bottom: 2rem;
    }
  }
}

.button-group {
  margin-top: 13rem;
  margin-right: 1.5rem;
  text-align: end;

  button {
    width: 7.5rem;
    padding: 1rem 1.25rem;
    margin-left: 1rem;
  }

  span {
    color: $color-brand;
  }

  @include respond($bp-mobile) {
    display: inline-block;
    margin-top: 0;
    margin-left: auto;
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

.source-post {
  display: grid;
  grid-template-columns: min-content auto;
  grid-template-rows: 2rem min-content min-content;
  grid-column-gap: 1rem;

  margin-top: 1rem;
  position: relative;

  &::after {
    content: "";
    width: .15rem;
    height: calc(100% - 5.5rem);
    background-color: $color-gray-300;
    position: absolute;
    left: 3.25rem;
    top: 6rem;
  }

  img {
    margin-top: 0;
  }

	.text-content {
		grid-column: 2/-1;
	}

  p {
    padding: 1rem 1rem 1rem 0;
    border-bottom: none;
    &:last-child{
      font-weight: bold;
      color: $color-gray-700;
      grid-column: 2/-1;
    }
    span {
      padding-left: 1rem;
      color: $color-brand;
    }
  }
}

.reply {
  height: min-content;
	padding-bottom: 1.5rem;

  @include respond($bp-mobile) {
    height: 100%;
  }
}

// edit-profile
.profile-card {
  height: 60%;
}

.title {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  font-weight: bold;
  svg {
    margin: 0 2rem;
  }
  button {
    padding: 1rem 1.5rem;
    margin-right: 1rem;
    width: 6.4rem;
  }
  .title-text {
    flex: 1;
  }
}

.bg-wraper {
  margin-top: .5rem;
  background-image: url('./../assets/images/default-profile-bg.jpg');
  background-position: 50% 75%;
  background-size: cover;
  height: 20rem;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    fill: $color-gray-100;
    margin: 0 1rem;
    width: 2.4rem;
    height: 2.4rem;
    transition: fill .2s ease-in;

    &:hover {
      fill: $color-gray-300;
    }
  }
}

.avatar-wraper {
  width: 14rem;
  height: 14rem;
  background-image: url('./../assets/images/default-avatar3.jpg');
  background-size: cover;

  border-radius: 50%;
  border: 5px solid $color-gray-100;
  position: relative;

  transform: translate(1rem ,-50%);

  svg {
    position: absolute;
    top: calc(37.5% + 5px);
    left: calc(37.5% - 5px);
    fill: $color-gray-100;
    margin: 0 1rem;
    width: 2.4rem;
    height: 2.4rem;
    transition: fill .2s ease-in;

    &:hover {
      fill: $color-gray-300;
    }
  }
}

.profile-input-group {
  margin-top: -6rem;
  display: flex;
  flex-direction: column;

  label,input,textarea {
    background-color: $color-gray-200;
  }

  label {
    color: $color-gray-800;
    padding-bottom: .5rem;
  }

  input {
    border: none;
    &:focus {
      outline: none;
    }
  }

  input,textarea {
    border-bottom: 2px solid $color-gray-900;
  }

  textarea {
    width: 100%;
    padding: 0;
    height: 9rem;
  }

  span {
    align-self: flex-end;
  }
}

// transitions

.modal-fade-enter-active {
  transition: all .2s ease-in-out;
}

.modal-fade-leave-active {
  transition: all .2s ease-in-out .3s;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
  transform-origin: top left;
  transform: scale(0);
}

.modal-fade-enter-to,
.modal-fade-leave {
  opacity: 1;
  transform-origin: top left;
  transform: scale(1);
}


.modal-inner-offset-enter-active {
  transition: transform .2s ease-in-out .3s;
}

.modal-inner-offset-leave-active {
  transition: transform .2s ease-in-out
}

.modal-inner-offset-enter,
.modal-inner-offset-leave-to {
  transform: translateY(-130%);
}

.modal-inner-offset-enter-to,
.modal-inner-offset-leave {
  transform: translateY(0);
}



</style>