<template>
  <transition name="list">
    <div class="user-like-list">
      <span @click="closeList">
        <svg class="">
          <use href="@/assets/images/symbol-defs.svg#icon-cross"></use>
        </svg>
      </span>
      <div class="user-card-wrapper">
        <div class="user-card"
          v-for="user in users" :key="user.id"
          @click="toUserProfile(user.id)"
        >
          <img :src="user.avatarUrl"/>
          <div class="name-alias">
            <h5>{{ user.name }}</h5>
            <span>@{{ user.alias }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConditionUserList',
  props: ['userIdList'],
  computed: {
    users() {
      const allUsers = this.$store.getters.users
      const results = []

      this.userIdList.forEach(id => {
        const target = allUsers.find(user => user.id === id)
        if (target) {
          const { id, name, alias, avatarUrl } = target
          results.push({
            id,
            name,
            alias,
            avatarUrl
          })
        }
      })
      return results
    }
  },
  methods: {
    closeList() {
      this.$store.state.isConditionUserListActivated = false
    },
    async toUserProfile(userId) {
      this.$router.push({
        name: 'posts',
        params: { userId }
      })

      await this.$store.dispatch('postAbout/getUserPosts', userId)
      await this.$store.dispatch('userAbout/getUser', userId)
    }
  },
}

</script>

<style lang="scss" scoped>

.user-like-list {
  position: absolute;
  top: 50%;
  width: 60%;
  max-width: 45rem;
  border-radius: 1rem;
  box-shadow: $box-shadow-normal;
  background-color: white;
  z-index: 999;


  .user-card-wrapper {
    max-height: 45rem;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .user-card {
    display: flex;
    cursor: pointer;
    border-radius: 1rem;

    padding: .5rem .5rem;
    transition: all .2s ease-in;
    &:hover {
      background-color: $color-brand;
    }
  }
}

svg {
  position: absolute;
  right: -2rem;
  top: -2rem;
  width: 2rem;
  height: 2rem;
  padding: .3rem;
  border-radius: 50%;
  border: 2px solid $color-brand;
  cursor: pointer;
}

.name-alias {
  margin-left: 2rem;
}

// transition
.list-enter-active {
  transition: all 0.2s ease-in-out;
}

.list-leave-active {
  transition: all 0.2s ease-in-out 0.3s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform-origin: top;
  transform: scale(0);
}

.list-enter-to,
.list-leave {
  opacity: 1;
  transform-origin: top;
  transform: scale(1);
}



</style>