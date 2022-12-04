import axios from 'axios'

export const userOptions = {
  namespaced: true,
  getters: {
    loginedUserId(state, getters, rootState, rootGetters) {
      return rootGetters.loginedUserId
    }
  },
  actions: {
    async googleOauth(context, token) {
      const { data } = await axios.post(
        `${context.rootState.API_URL}/users/google`,
        { token }
      )

      context.commit('SAVE_USER_DATA', data)
      context.state.isAuthenticated = true
    },

    async auth(context, loginInfo) {
      const loginedUserData = await axios.post(
        `${context.rootState.API_URL}/users/normal`,
        loginInfo
      )
      if (!loginedUserData.data) {
        throw new Error()
      }
      context.commit('SAVE_USER_DATA', loginedUserData.data)
      context.state.isAuthenticated = true
    },

    async authAdmin(context, loginInfo) {
      alert('authAdmin')
      const admin = await axios.post(
        `${context.rootState.API_URL}/users/admin`,
        loginInfo
      )

      context.commit('SAVE_USER_DATA', admin.data)
    },

    async getUsers(context) {
      const { data } = await axios.get(`${context.rootState.API_URL}/users`)

      context.state.users = data
    },

    async getPopUsers(context) {
      const popUsers = await axios.get(
        `${context.rootState.API_URL}/users/popular/${context.state.loginedUserData.id}/0`
      )

      context.state.popUsers = popUsers.data
    },
    async getUser(context, userId) {
      //* avoid logined user making infos request again.
      if (userId === context.state.loginedUserData.id) return

      const { data } = await axios.get(
        `${context.rootState.API_URL}/users/${userId}`
      )
      context.commit('SAVE_USER_DATA', data)
    },

    async postUser(context, userInfo) {
      const { data } = await axios.post(context.rootState.API_URL, userInfo)
      context.commit('SAVE_USER_DATA', data)
      // TODO: direct user to home page or setting page
    },

    async updateProfile(context, newInfo) {
      try {
        const { data } = await axios.patch(
          `${context.rootState.API_URL}/users/${context.rootGetters.loginedUserId}`,
          newInfo
        )
        if (!data) {
          throw new Error()
        }
        context.commit('SAVE_USER_DATA', data)
      } catch (err) {
        context.commit(
          'TRIGGER_TOAST',
          {
            type: 'error',
            detail: '別名已存在'
          },
          { root: true }
        )
      }
    }
  },
  mutations: {
    SAVE_USER_DATA(state, userInfo) {
      if (
        Object.hasOwn(state.loginedUserData, 'id') &&
        userInfo.id !== state.loginedUserData.id
      ) {
        state.otherUserData = userInfo
        return
      }
      state.loginedUserData = userInfo
      state.userRole = userInfo.role
    },
    ARRANGE_USERS(state, orderRule) {
      switch (orderRule) {
        case 'createdAt':
          state.users.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
          })
          break
        case 'mostPosts':
          state.users.sort((a, b) => {
            return b._count.posts - a._count.posts
          })
          break
        case 'mostPostLikeds':
          state.users.sort((a, b) => {
            a.postLikeds = a.posts.reduce((prev, current) => {
              return prev + current.liked.length
            }, 0)

            b.postLikeds = b.posts.reduce((prev, current) => {
              return prev + current.liked.length
            }, 0)

            return b.postLikeds - a.postLikeds
          })

          break
        case 'follows':
          state.users.sort((a, b) => {
            return b._count.follow - a._count.follow
          })
          break
        case 'followeds':
          state.users.sort((a, b) => {
            return b._count.followed - a._count.followed
          })
          break
      }
    },
    UPDATE_FOLLOWSHIP(state, followship) {
      // * followship param not passed in means remove exist followship
      if (followship) {
        for (const user of state.users) {
          if (user.id === followship.followedId) {
            user.followed.unshift(followship)
            state.otherUserData.followed.unshift(followship)
            return
          }
        }
      }

      for (const user of state.users) {
        if (user.id === state.otherUserData.id) {
          const targetFollowship = user.followed.find(
            (f) => f.followerId === this.getters.loginedUserId
          )
          const targetFollowshipIndex = user.followed.indexOf(targetFollowship)
          user.followed.splice(targetFollowshipIndex, 1)
          state.otherUserData.followed.splice(targetFollowshipIndex, 1)
          return
        }
      }
    },
    UPDATE_SPONSOR_STATE(state) {
      console.log('ready to mutate')
      state.loginedUserData.isSponsor = true
    }
  },
  state: {
    isAuthenticated: false,
    userRole: 'normal',
    loginedUserData: {},
    otherUserData: {},
    users: []
  }
}
