<template>
  <div class="post-list-page">
    <PageInfoBar />
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
      <div class="toggle-posts-per-page">
        <label>每頁顯示筆數</label>
        <button
          :class="{ active: postCountPerPage === 10 }"
          @click="togglePostCountPerPage"
        >
          10
        </button>
        <button
          :class="{ active: postCountPerPage === 30 }"
          @click="togglePostCountPerPage"
        >
          30
        </button>
        <button
          :class="{ active: postCountPerPage === 50 }"
          @click="togglePostCountPerPage"
        >
          50
        </button>
      </div>

      <div class="toggle-show-media">
        <label>顯示圖片與短片</label>
        <label class="switch">
          <input type="checkbox" v-model="isShowMedia" />
          <span class="slider"></span>
        </label>
      </div>
      <!-- TODO: modulize SwitchButton -->
      <!-- <SwitchButton :label="'顯示圖片與短片'"/> -->

      <div class="toggle-search-mode">
        <label>以內文查詢</label>
        <label class="switch">
          <input type="checkbox" v-model="isOnSearch" />
          <span class="slider"></span>
        </label>
        <div class="search" v-show="isOnSearch">
          <label for="keyword">輸入內文關鍵字</label>
          <input
            id="keyword"
            type="text"
            v-model="keyword"
            @keyup.enter="searchByContents"
          />
          <button @click="searchByContents">查詢</button>
        </div>
      </div>
    </div>

    <div class="post-list">
      <PostItem
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :isShowMedia="isShowMedia"
      >
      </PostItem>
    </div>

    <div v-if="!isOnSearch" class="pagination">
      <span v-if="currentPageNum > 1" @click="toPrevious">&#60;</span>
      <span
        v-for="n in pageButtonCount"
        :key="n"
        @click="switchPagination(n + 5 * currentPageGroup)"
        :class="{ active: currentPageNum === n + 5 * currentPageGroup }"
        >{{ n + 5 * currentPageGroup }}</span
      >
      <span v-if="currentPageNum !== totalPages" @click="toNext">&#62;</span>
    </div>
  </div>
</template>

<script>
import PageInfoBar from '../../components/PageInfoBar.vue'
import PostItem from '../../components/PostItem.vue'
// import SwitchButton from '../../components/SwitchButton'

// import SearchBar from '../../components/SearchBar.vue'
export default {
  name: 'PostListPage',
  data() {
    return {
      isShowMedia: false,
      order: 'newest',
      postCountPerPage: 10,
      currentPageNum: 1,
      currentPageGroup: 0,
      isOnSearch: false,
      keyword: '',
      searchedPostsCurrentPage: []
    }
  },
  components: { PageInfoBar, PostItem },
  computed: {
    posts() {
      const searchedPosts = this.$store.getters.showingSearchedPosts
      if (this.searchedPostsCurrentPage.length) return this.searchedPostsCurrentPage
      if (!searchedPosts.length || !this.isOnSearch) return this.$store.getters.showingPosts
      return this.$store.getters.showingSearchedPosts
    },
    totalPages() {
      return Math.ceil(this.$store.getters.postCount / this.postCountPerPage)
    },
    pageButtonCount() {
      if ((this.totalPages - 4) < this.currentPageNum) {
        return this.totalPages % 5
      }
      return 5
    }
  },
  watch: {
    // * 0 represents get posts from the fiWrst one
    order(newVal) {
      if (this.isOnSearch) {
        // this.showSearchedPosts(0)
        this.$store.commit('postAbout/SORT_SHOWING_POSTS', newVal)
        this.showSearchedPosts(0)
        return
      }
      this.getPosts(0)
    },
    postCountPerPage(newVal) {
      if (this.isOnSearch) {
        this.showSearchedPosts(0)
        return
      }
      this.postCountPerPage = newVal
      this.getPosts(0)
    },
    isOnSearch(newVal) {
      if (newVal) return
      // * reset data state
      this.searchedPostsCurrentPage = []
      this.order = 'newest',
      this.postCountPerPage = 10
      this.currentPageNum = 1
      this.getPosts(0)
    }
  },
  methods: {
    REMOVE_POST() {
      alert('22')
    },
    toggleShowMedia() {
      this.isShowMedia = !this.isShowMedia
    },
    togglePostCountPerPage(event) {
      this.postCountPerPage = Number(event.target.textContent)
    },
    switchPagination(pageToGo) {
      if (this.currentPageNum === pageToGo) return
      this.currentPageNum = pageToGo
      if (this.isOnSearch) {
        const index = (pageToGo - 1) * this.postCountPerPage
        this.showSearchedPosts(index)
        return
      }
      
      this.getPosts((pageToGo - 1) * this.postCountPerPage)
    },
    toNext() {
      if (!(this.currentPageNum % 5)) {
        this.currentPageGroup++
      }
      
      const skipPostsCount = this.currentPageNum * this.postCountPerPage
      this.getPosts(skipPostsCount)
      this.currentPageNum++
    },
    toPrevious() {
      if (this.currentPageNum % 5 === 1) {
        this.currentPageGroup--
      }

      const skipPostsCount = (this.currentPageNum - 2) * this.postCountPerPage
      this.getPosts(skipPostsCount)
      this.currentPageNum--
    },
    getPosts(skipPostsCount) {
      this.$store.dispatch('postAbout/getAdminPagePosts', {
        skipPostsCount,
        take: this.postCountPerPage,
        order: this.order
      })
    },
    searchByContents() {
      this.$store.dispatch('postAbout/getAdminPagePosts', {
        skipPostsCount: 0,
        take: this.postCountPerPage,
        order: this.order,
        keyword: this.keyword
      })
    },
    showSearchedPosts(index){
      const searchedPosts = this.$store.getters.showingPosts
      const parsedPosts = Object.values(JSON.parse(JSON.stringify(searchedPosts)))
      const posts = parsedPosts.slice(index, index + this.postCountPerPage)
      // * check order rule if is on search mode

      this.searchedPostsCurrentPage = posts
    }
  }
}
</script>

<style lang="scss" scoped>
.controls {
  position: relative;
  z-index: 99;
  height: 15rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-bottom: 1px solid $color-gray-600;
  padding-top: 1rem;
  padding-bottom: 1rem;

  div {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  label {
    flex: 1;
  }

  .toggle-show-media,
  .toggle-search-mode {
    label {
      flex: unset;
    }
  }

  .search {
    position: absolute;
    bottom: 1rem;
    right: 1.5rem;

    width: 15rem;
    height: 10rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    button {
      background-color: $color-brand;
    }
  }
}

.toggle-posts-per-page {
  button {
    border-radius: unset;
    padding: 0.5rem 1.5rem 0.5rem 1.5rem;
    background-color: $color-gray-400;

    &:first-of-type {
      border-radius: 1.5rem 0 0 1.5rem;
    }

    &:last-of-type {
      border-radius: 0 1.5rem 1.5rem 0;
    }
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

// * switch
.switch {
  position: relative;
  width: 5rem;
  height: 2.4rem;

  input {
    display: none;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-gray-400;
  transition: 0.4s;
  border-radius: 2rem;
}

.slider:before {
  position: absolute;
  content: '';
  height: 2rem;
  width: 2rem;
  left: 2px;
  top: 2px;
  background-color: $color-gray-100;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: $color-brand;
}

input:checked + .slider:before {
  transform: translateX(2.6rem);
}
</style>
