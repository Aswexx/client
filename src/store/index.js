import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const actions = {
  async postUser(context, userInfo) {
    const { data } = await axios.post(context.state.API_URL, userInfo)
    context.commit('SAVEUSERDATA', data)
  }
}

const mutations = {
  CHANGEVIEWPORT(state, value) {
    state.viewport = value
  },
  SAVEUSERDATA(state, value) {
    state.userData = value
    state.userRole = value.role
  }
}

const state = {
  viewport: window.innerWidth,
  isAuthenticated: true,
  userRole: 'normal',
  userData: {},
  API_URL: 'http://localhost:4000/users'
}

export default new Vuex.Store({
  actions,
  mutations,
  state
})
