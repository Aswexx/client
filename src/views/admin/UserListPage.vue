<template >
  <div class="user-list">
    <PageInfoBar/>
    <div class="controls">
      <label for="order-rule">排列規則</label>
      <select id="order-rule" v-model="orderRule">
        <option value="createdAt">註冊時間</option>
        <option value="mostPosts">總發文數</option>
        <option value="mostPostLikeds">總貼文被喜歡數</option>
        <option value="follows">追蹤數</option>
        <option value="followeds">被追蹤數</option>
      </select>
    </div>
    <div class="card-container">
      <UserCard
        v-for="user in users" :key="user.id" :user="user"
      />
    </div>
  </div>
</template>

<script>
import PageInfoBar from '../../components/PageInfoBar.vue'
import UserCard from '../../components/UserCard.vue'

export default {
  data() {
    return {
      orderRule: 'createdAt'
    }
  },
  components: { PageInfoBar, UserCard },
  computed: {
    users() {
      return this.$store.getters.users
    }
  },
  watch:{
    orderRule(newVal){
      this.$store.commit('userAbout/ARRANGE_USERS', newVal)
    }
  },
  beforeCreate(){
    this.$store.dispatch('userAbout/getUsers')
  },
}
</script>

<style lang="scss" scoped>
  .user-list {
    grid-column: 2/4;
    width: 100%;
  }

  .controls {
    padding: 2rem 0 2rem 0;
    width: 30%;
    display: flex;
    justify-content: space-between;
  }

  .card-container {
    height: 90vh;
    overflow-y: scroll;

    display: grid;
    grid-template-columns: repeat(auto-fit, 22rem);
    grid-gap: 1rem;
  }
</style>
