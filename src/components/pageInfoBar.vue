<template>
  <div class="page-info">
    <div class="setting" v-if="isAdmin">
      <h3>{{ pageTitle }}</h3>
    </div>

    <div class="post-detail" v-else-if="$route.name === 'post-detail'">
      <svg @click="goPreviousRoute">
        <use
          xlink:href="./../assets/images/symbol-defs.svg#icon-arrow-left2"
        ></use>
      </svg>
      <h3>推文</h3>
    </div>

    <div
      class="personal"
      v-else-if="
        $route.name === 'home' || ($route.name === 'posts' && !matchMobile)
      "
    >
      <svg @click="goPreviousRoute">
        <use
          xlink:href="./../assets/images/symbol-defs.svg#icon-arrow-left2"
        ></use>
      </svg>
      <h5>{{ showingUserInfo.name }}</h5>
      <p>@ {{ showingUserInfo.alias }}</p>
    </div>

    <div
      class="personal-mobile-view"
      v-else-if="$route.name !== 'setting' && matchMobile"
    >
      <img src="../assets/images/default-avatar.jpg" alt="img" />
      <h2>test</h2>
    </div>

    <div class="setting" v-else-if="$route.name === 'notifications'">
      <h3>通知</h3>
    </div>

    <div class="setting" v-else-if="$route.name === 'comment-detail'">
      <h3>評論</h3>
    </div>

    <div class="setting" v-else>
      <h3>帳戶設定</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      viewport: this.$store.state.viewport,
      isAdmin: this.$store.state.userAbout.userRole === 'admin',
      currentPage: this.$route.name
    }
  },
  computed: {
    showingUserInfo() {
      if (!this.$store.state.userAbout.otherUserData.id) {
        return this.$store.state.userAbout.loginedUserData
      }

      return this.$store.state.userAbout.otherUserData
    },
    matchMobile() {
      return this.viewport <= 576
    },
    pageTitle() {
      if (this.currentPage === 'post-list') {
        return '推文清單'
      }
      return '使用者列表'
    }
  },
  methods: {
    updateViewport() {
      this.viewport = this.$store.state.viewport
    },
    goPreviousRoute() {
      this.$router.back()
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateViewport)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateViewport)
  }
}
</script>

<style lang="scss" scoped>
@import './../assets/scss/base.scss';

div.page-info {
  border-bottom: 1px solid $color-gray-400;
  padding: 1rem 1rem 1rem 0rem;
}

.post-detail {
  h3 {
    display: inline-block;
    padding: 0 1rem;
  }
}

svg {
  width: 1.7rem;
  height: 1.4rem;
  transition: all 0.2s ease-in;
  cursor: pointer;

  &:hover {
    fill: $color-brand;
    transform: scale(1.3, 1.3);
  }
}

.personal {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-column-gap: 1.5rem;

  svg {
    grid-row: 1/3;
    align-self: center;
  }
}

.personal-mobile-view {
  display: flex;
  img {
    margin-right: 2rem;
  }
}

.setting {
  h3 {
    height: 4rem;
  }
}
</style>