import Vue from 'vue'
import Vuex from 'vuex'
import { userOptions } from './userOptions'
import { postOptions } from './postOptions'
import { commentOptions } from './commentOptions'
import axios from 'axios'

Vue.use(Vuex)

const getters = {
  showingPosts(state) {
    return state.postAbout.showingPosts
  },
  tempPost(state) {
    return state.postAbout.tempPost
  },
  loginedUserId(state) {
    return state.userAbout.loginedUserData.id
  }
}

const actions = {
  async sendChatNotification(context, receiverId) {
    const notifData = {
      informerId: context.state.userAbout.loginedUserData.id,
      receiverId,
      notifType: 'inviteChat'
    }
    await axios.post(`${context.state.API_URL}/notifications`, notifData)
    // context.commit('TOGGLE_CHAT', notifData.informerId)
  }
}
const mutations = {
  CHANGE_VIEWPORT(state, value) {
    state.viewport = value
  },
  TOGGLE_MODAL(state, contents) {
    state.isModalOpened = !state.isModalOpened
    if (!contents) {
      state.modalType = ''
      state.sourcePostOrComment = {}
      return // contents null represents try to close modal or trigger post modal
    }
    state.sourcePostOrComment = contents
    state.modalType = contents.modalType
  },
  TRIGGER_TOAST(state, toast) {
    state.toastType = toast.type
    state.toastDetail = toast.detail
    state.isToastShow = true

    window.timer = setTimeout(() => {
      state.isToastShow = false
    }, 5300)
  },
  TOGGLE_CHAT(state, roomId) {
    state.isChatRoomOn = !state.isChatRoomOn
    state.chatRoomId = roomId
  },
  ADD_NOTIFICATION(state, notification) {
    state.notifications.unshift(notification)
  }
}

const state = {
  viewport: window.innerWidth,

  isModalOpened: '',
  modalType: '',

  isToastShow: false,
  toastType: '',
  toastDetail: '',

  isChatRoomOn: false,
  chatRoomId: '',

  sourcePostOrComment: {},
  notifications: [],
  API_URL: 'http://localhost:4000'
}

export default new Vuex.Store({
  getters,
  actions,
  mutations,
  state,
  modules: {
    userAbout: userOptions,
    postAbout: postOptions,
    commentAbout: commentOptions
  }
})
