import axios from 'axios'

export const userOptions = {
  namespaced: true,
  actions: {
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
    isAuthenticated: true,
    userRole: 'normal',
    loginedUserData: {},
    otherUserData: {},
    popUsers: []
  }
}
