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
    if (!contents) {
      state.modalType = ''
      state.sourcePost = {}
      return // contents null represents try to close modal or trigger post modal
    }
    state.sourcePost = contents
    state.modalType = 'reply'
  },
  TRIGGER_TOAST(state, toast) {
    state.toastType = toast.type
    state.toastDetail = toast.detail
    state.isToastShow = true

    window.timer = setTimeout(() => {
      state.isToastShow = false
    }, 5300)
  }
}

const state = {
  viewport: window.innerWidth,
  isModalOpened: '',
  modalType: '',
  isToastShow: false,
  toastType: '',
  toastDetail: '',
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
