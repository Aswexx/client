import Vue from 'vue'
import Vuex from 'vuex'
import { userOptions } from './userOptions'
import { postOptions } from './postOptions'
import { commentOptions } from './commentOptions'

Vue.use(Vuex)

const actions = {}
const mutations = {
  CHANGE_VIEWPORT(state, value) {
    state.viewport = value
  },
  TOGGLE_MODAL(state, contents) {
    state.isModalOpened = !state.isModalOpened
    if (!contents) return // null represents try to close modal
    state.sourcePost = contents
    state.modalType = 'reply'
  },
  RESET_STATES(state) {
    const initialState = {
      ...state,
      viewport: window.innerWidth,
      isAuthenticated: true,
      isModalOpened: false,
      sourcePost: {}
    }
    Object.assign(state, initialState)
  }
}

const state = {
  viewport: window.innerWidth,
  isModalOpened: '',
  modalType: '',
  sourcePost: {},
  API_URL: 'http://localhost:4000'
}

export default new Vuex.Store({
  actions,
  mutations,
  state,
  modules: {
    userAbout: userOptions,
    postAbout: postOptions,
    commentAbout: commentOptions
  }
})
