<template>
  <div class="post-item" 
    v-if="post.author"
    @click="toPostDetail(post)"
  >
    <img alt="avatar"
      :src="post.author.avatar.url"
    >
    <div class="interact">
      <span><b>{{ post.author.name }}</b>@{{ post.author.alias }} ‧ {{ relativeTime }}</span>
      <span 
        v-if="isUserOwn"
        @click.stop="deletePost(post.id)"
      >
        <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use></svg>
      </span>
    </div>
    <p 
      :class="{'home-page': $route.name === 'home'}"
    >
      {{ post.contents }}
    </p>
    
    <div class="count"
      v-if="$route.name !== 'post-detail'"
    >
      <button
        @click.stop="showReplyModal(post)"
      >
        <svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-msg-sm"></use></svg>
        <span>{{ post.comments.length }}</span>
      </button>
      <button>
        <svg 
          v-if="!isLike"
        >
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-heart-normal"></use>
        </svg>
        <svg class="heart-icon" 
          v-else
        >
          <use xlink:href="./../assets/images/symbol-defs.svg#icon-heart-solid"></use>
        </svg>
        <span>{{ post.liked.length }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { parseISO } from 'date-fns/esm/fp'
import { zhTW } from 'date-fns/locale'
export default {
  name: 'PostItem',
  data(){
    return {
      isLike: false,
    }
  },
  props: {
    post: {
      type: Object,
    }
  },
  computed: {
    relativeTime(){
      return formatDistanceToNow(
        parseISO(this.post.createdAt),
        {
          addSuffix: true,
          locale: zhTW
        }
      )
    },
    isUserOwn() {
      return this.post.author.id === this.$store.state.userAbout.loginedUserData.id
    }
  },
  methods:{
    showReplyModal(post){
      post = {
        ...post,
        relativeTime: this.relativeTime
      }
      this.$store.commit('TOGGLE_MODAL', post)
    },
    deletePost(postId){
      // TODO:optimize notification
      if (!confirm('確定刪除?')) return
      this.$store.dispatch('postAbout/deletePost', postId)
    },
    toPostDetail(post){
      if (this.$route.name === 'post-detail') return
      this.$router.push({
        name: 'post-detail',
        params: { post }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

  .post-item {
    min-height: 12rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    cursor: pointer;

    display: grid;
    grid-template-columns: min-content auto;
    grid-column-gap: 1rem;
    grid-row-gap: .5rem;

    // hover effect set
    border-bottom: 1px solid $color-gray-400;
    background-color: rgba(white, 0.1);
    box-shadow:
      0px 
      1rem
      2rem
      rgba(white, .1);
    backdrop-filter: blur(2px);
    transition: transform .5s ease-out;
    overflow: hidden;

    &::before {
      content: '';
      background: rgba(white, 0.4);
      width: 60%;
      height: 100%;
      top: 0%;
      left: -125%;

      transform: skew(45deg);
      position: absolute;
      transition: left .5s ease-out;
    }

    &:hover {
      &::before {
        left: 150%;
      }
    }
  }

  p.home-page {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4; 
    -webkit-box-orient: vertical;
  }

  .interact {
    display: flex;
    justify-content: space-between;
    b {
      padding-right: 1rem;
    }

    span:nth-of-type(2){
      margin-right: 1.5rem;
    }

    svg {
      width: 1.2rem;
      height: 1.2rem;
      cursor: pointer;
    }
  }

  .count {
    width: 12rem;
    display: flex;
    justify-content: space-between;
    grid-column: 2/-1;

    span {
      padding-left: .5rem;
    }

    a , button{
      display: flex;
      align-items: center;
    }
  }

  img {
    grid-row: 1/4;
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  button {
    width: 4.2rem;
    padding: 0;
    background-color: transparent;
    color: $color-gray-700;
  }

  a {
    text-decoration: none;
    color: $color-gray-900;
  }

  .heart-icon {
    fill: crimson;
  }


</style>