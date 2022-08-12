import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const actions = {
  async postUser(context, userInfo) {
    const { data } = await axios.post(context.state.API_URL, userInfo)
    context.commit('SAVEUSERDATA', data)
  },

  async addFollowShip(context, userId) {
    const followShipInfo = {
      followerId: context.state.userData.id,
      followedId: userId
    }
    const { data } = await axios.put(
      `${context.state.API_URL}/users/`,
      followShipInfo
    )

    console.log('🧨', data)
    context.commit('ADDFOLLOWSHIP', data)
  },

  async removeFollowShip(context, followShip) {
    const followShipId = followShip.id
    const { data } = await axios.delete(
      `${context.state.API_URL}/users/${followShipId}`
    )

    context.commit('REMOVEFOLLOWSHIP', data)
  },

  async getUserPosts(context) {
    if (context.state.userPosts.length) return
    const { data } = await axios.get(
      `${context.state.API_URL}/posts/${context.state.userData.id}/newestTen`
    )
    context.commit('SAVEUSERPOSTS', data)
  },

  async submitNewPost(context, postContents) {
    const postInfo = {
      authorId: context.state.userData.id,
      contents: postContents
    }
    const { data } = await axios.post(
      `${context.state.API_URL}/posts/`,
      postInfo
    )

    context.commit('SAVENEWPOST', data)
  },

  async deletePost(context, postId) {
    await axios.delete(`${context.state.API_URL}/posts/${postId}`)

    context.commit('REMOVEPOST', postId)
  }
}

const mutations = {
  CHANGEVIEWPORT(state, value) {
    state.viewport = value
  },
  SAVEUSERDATA(state, userInfo) {
    state.userData = userInfo
    state.userRole = userInfo.role
  },
  SAVEUSERPOSTS(state, posts) {
    state.userPosts.push(...posts)
  },
  SAVENEWPOST(state, post) {
    state.userPosts.unshift(post)
    state.showingPosts.unshift(post)
  },
  ADDFOLLOWSHIP(state, followShip) {
    state.popUsers.forEach((popUser) => {
      if (popUser.id === followShip.followedId) {
        popUser.followed.unshift(followShip)
        return
      }
    })
  },
  REMOVEFOLLOWSHIP(state, followShip) {
    state.popUsers.forEach((popUser) => {
      if (popUser.id === followShip.followedId) {
        const followShipIndex = popUser.followed.indexOf(followShip)
        popUser.followed.splice(followShipIndex, 1)
      }
    })
  },
  REMOVEPOST(state, postId) {
    const postToRemove = state.showingPosts.find((post) => post.id === postId)
    let index = state.showingPosts.indexOf(postToRemove)
    state.showingPosts.splice(index, 1)

    if (!state.userPosts.length) return
    index = state.userPosts.indexOf(postToRemove)
    state.userPosts.splice(index, 1)
  },
  RESETSTATES(state) {
    const initialState = {
      ...state,
      viewport: window.innerWidth,
      isAuthenticated: true,
      userRole: 'normal',
      userData: {},
      userPosts: [],
      showingPosts: [],
      popUsers: []
    }

    Object.assign(state, initialState)
  }
}

//TODO: make states persistant
const state = {
  viewport: window.innerWidth,
  isAuthenticated: true,
  userRole: 'normal',
  userData: {},
  userPosts: [],
  showingPosts: [],
  popUsers: [],
  API_URL: 'http://localhost:4000'
}

export default new Vuex.Store({
  actions,
  mutations,
  state
})
