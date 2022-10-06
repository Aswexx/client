<template>
  <div class="post-list-page">
    <PageInfoBar/>
    <div class="controls">
      <div class="order-methods">
        <label for="order">排序方式</label>
        <select id="order" v-model="order">
          <option value="newest">最新到最舊</option>
          <option value="oldest">最舊到最新</option>
          <option value="mostComments">評論數最多到最少</option>
          <option value="mostLikes">被喜歡數最多到最少</option>
        </select>
      </div>
      <div class="toggle-show-media">
        <label>顯示圖片與短片</label>
        <button :class="{active: isShowMedia}" @click="toggleShowMedia">顯示</button>
        <button :class="{active: !isShowMedia}" @click="toggleShowMedia">不顯示</button>
      </div>
      <div class="toggle-posts-per-page">
        <label>每頁顯示筆數</label>
        <button :class="{active: postCountPerPage === 10}" @click="togglePostCountPerPage">10</button>
        <button :class="{active: postCountPerPage === 30}" @click="togglePostCountPerPage">30</button>
        <button :class="{active: postCountPerPage === 50}" @click="togglePostCountPerPage">50</button>
      </div>

      <div>
        <input type="checkbox" id="search" checked="checked">
        <label for="search">以內文查詢</label>
        <input type="text" placeholder="xxx">
        <button v-if="!isOnSearch">查詢</button>
      </div>

    </div>
    <div class="post-list">
      <PostItem 
        v-for="post in posts" 
        :key="post.id" 
        :post="post" 
        :isShowMedia="isShowMedia">
      </PostItem>
    </div>

    <div class="pagination">
      <span>&#60;</span>
      <span 
        v-for="n in totalPages" 
        :key="n" 
        @click="switchPagination(n)"
        :class="{ active: currentPageNum === n }"
      >{{ n }}</span>
      <span>&#62;</span>
    </div>
  </div>
</template>

<script>
import PageInfoBar from '../../components/PageInfoBar.vue'
import PostItem from '../../components/PostItem.vue'
export default {
  data() {
    return {
      isShowMedia: true,
      order: 'newest',
      postCountPerPage: 10,
      currentPageNum: 1,
      isOnSearch: false
    }
  },
  components: { PageInfoBar, PostItem },
  computed: {
    posts(){
      return this.$store.getters.showingPosts
    },
    totalPages(){
      return Math.ceil(this.$store.getters.postCount / this.postCountPerPage)
    }
  },
  watch: {
    // * 0 represents get posts from the first one
    order() {
      this.getPosts(0)
    },
    postCountPerPage(newVal) {
      this.postCountPerPage = newVal
      this.getPosts(0)
    }
  },
  methods: {
    REMOVE_POST(){
      alert('22')
    },
    toggleShowMedia(){
      this.isShowMedia = !this.isShowMedia
    },
    togglePostCountPerPage(event){
      this.postCountPerPage = Number(event.target.textContent)
    },
    switchPagination(pageToGo){
      alert(pageToGo)
      this.currentPageNum = pageToGo
      this.getPosts(((pageToGo) - 1) * this.postCountPerPage)
    },
    getPosts(skipPostsCount){
      this.$store.dispatch('postAbout/getAdminPagePosts', {
        skipPostsCount,
        take: this.postCountPerPage,
        order: this.order
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .controls {
    grid-column: 3 / 4;
    height: 30rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    border-bottom: 1px solid $color-gray-600;
    padding-top: 1rem;
    padding-bottom: 1rem;

    div {
      width: 60%;
      display: flex;
      align-items: center;

      label {
        flex: 1;
      }
    }
  }

  .toggle-show-media,
  .toggle-posts-per-page {
    button {
      background-color: $color-gray-400;
    }
    button.active {
      background-color: $color-brand;
    }
  }

  .post-list-page {
    grid-column: 2/3;
  }

  .post-list {
    border-bottom: 1px solid $color-gray-900;
    height: 67rem;
    overflow-y: auto;
  }

  .pagination {
    width: 60%;
    display: flex;
    justify-content: space-around;
    span {
      width: 2.5rem;
      text-align: center;
      cursor: pointer;
    }
    span.active {
      background-color: $color-brand;
    }
    span:hover {
      background-color: $color-brand;
    }
  }


</style>