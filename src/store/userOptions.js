import axios from 'axios'

export const userOptions = {
  namespaced: true,
  actions: {
    async googleOauth(context, token) {
      console.log(token)
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

      data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

      context.state.users = data
    },

    async getPopUsers(context) {
      const popUsers = await axios.get(
        `${context.rootState.API_URL}/users/popular/${context.state.loginedUserData.id}`
      )

      context.state.popUsers = popUsers.data
    },
    async getUser(context, userId) {
      //* avoid logined user makeing infos request again.
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
        const result = await axios.patch(
          `${context.rootState.API_URL}/users/${context.rootGetters.loginedUserId}`,
          newInfo
        )
        if (!result.data) {
          throw new Error('欄位不符')
        }
      } catch (err) {
        console.log(err.message)
      }
    },

    async addFollowship(context, userId) {
      const followShipInfo = {
        followerId: context.state.loginedUserData.id,
        followedId: userId
      }
      const { data } = await axios.put(
        `${context.rootState.API_URL}/users/`,
        followShipInfo
      )

      context.commit('ADD_FOLLOWSHIP', data)
    },

    async removeFollowship(context, followship) {
      const followShipId = followship.id
      const { data } = await axios.delete(
        `${context.rootState.API_URL}/users/${followShipId}`
      )

      context.commit('REMOVE_FOLLOWSHIP', data)
    }
  },

  mutations: {
    SAVE_USER_DATA(state, userInfo) {
      if (Object.hasOwn(state.loginedUserData, 'id')) {
        state.otherUserData = userInfo
        return
      }
      state.loginedUserData = userInfo
      state.userRole = userInfo.role
    },
    ADD_FOLLOWSHIP(state, followship) {
      state.popUsers.forEach((popUser) => {
        if (popUser.id === followship.followedId) {
          popUser.followed.unshift(followship)
          state.otherUserData.followed.unshift(followship)
          return
        }
      })
    },
    ARRANGE_USERS(state, orderRule) {
      alert('ch state')
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
    REMOVE_FOLLOWSHIP(state, followship) {
      state.popUsers.forEach((popUser) => {
        if (popUser.id === followship.followedId) {
          const followShipIndex = popUser.followed.indexOf(followship)
          popUser.followed.splice(followShipIndex, 1)
          state.otherUserData.followed.splice(followShipIndex, 1)
        }
      })
    }
  },
  state: {
    isAuthenticated: false,
    userRole: 'normal',
    loginedUserData: {},
    otherUserData: {},
    users: [],
    popUsers: []
  }
}
