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
        {
          token,
          isIOSdevice: context.rootState.isIOSdevice
        }
      )

      console.log('🐶🐶🐶', data)

      context.commit('SAVE_USER_DATA', data)
      context.state.isAuthenticated = true
    },

    async auth(context, loginInfo) {
      const { data } = await axios.post(
        `${context.rootState.API_URL}/users/normal`,
        loginInfo
      )
      
      if (!data) {
        throw new Error()
      }

      if (context.rootState.isIOSdevice) {
        context.commit('SAVE_USER_DATA', data.user)
        context.rootState.accessToken = data.accessToken
      } else {
        context.commit('SAVE_USER_DATA', data)
      }
      context.state.isAuthenticated = true
    },
    async authAdmin(context, loginInfo) {
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
        context.commit(
          'TRIGGER_TOAST',
          {
            type: 'success',
            detail: '個人資料已更新'
          },
          { root: true }
        )
      } catch (err) {
        context.commit(
          'TRIGGER_TOAST',
          {
            type: 'error',
            detail: '別名重複或上傳圖檔超過1MB，請重新操作'
          },
          { root: true }
        )
      }
    }
  },
  mutations: {
    SAVE_USER_DATA(state, userInfo) {
      console.log('saving user data...', userInfo)
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
      // * check if user is on other's profile page first
      // * followship param not passed in means remove exist followship
      const isOnOtherUserProfile = state.otherUserData.id ? true : false
      const loginedUserData = state.loginedUserData
      if (!isOnOtherUserProfile) {
        if (followship) {
          for (const user of state.users) {
            if (user.id === followship.followedId) {
              user.follow.unshift(followship)
              loginedUserData.follow.unshift(followship)
              return
            }
          }
        }
        for (const user of state.users) {
          const targetFollowship = user.follow.find(
            (f) => f.followerId === this.getters.loginedUserId
          )
          const targetFollowshipIndex = user.follow.indexOf(targetFollowship)
          user.follow.splice(targetFollowshipIndex, 1)
          loginedUserData.follow.splice(targetFollowshipIndex, 1)
          return
        }
      }

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
