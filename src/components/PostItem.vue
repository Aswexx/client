<template>
  <div class="post-item">
    <img alt="avatar"
      :src="post.author.avatar.url"
    >
    <div class="interact">
      <span><b>{{ post.author.name }}</b>@{{ post.author.alias }} ‧ {{ relativeTime }}</span>
      <span @click="deletePost(post.id)"><svg><use xlink:href="./../assets/images/symbol-defs.svg#icon-cross"></use></svg></span>
    </div>
    <p>{{ post.contents }}</p>
    <div class="count">
      <button href="#"
        @click="reply"
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
  data(){
    return {
      isLike: false
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
    }
  },
  methods:{
    reply(){
      this.$bus.$emit('activateModal','reply')
    },
    deletePost(postId){
      // TODO:optimize notification
      if (!confirm('確定刪除?')) return
      this.$store.dispatch('deletePost', postId)
    }
  },
  mounted(){
    
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

  .post-item {
    height: 12rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    border-bottom: 1px solid $color-gray-400;

    display: grid;
    grid-template-columns: min-content auto;
    grid-column-gap: 1rem;
    grid-row-gap: .5rem;
  }

  p {
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
      width: 1rem;
      height: 1rem;
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