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
  postCount(state) {
    return state.postAbout.postCount
  },
  tempPost(state) {
    return state.postAbout.tempPost
  },
  tempComment(state) {
    return state.postAbout.tempComment
  },
  users(state) {
    return state.userAbout.users
  },
  loginedUser(state) {
    return state.userAbout.loginedUserData
  },
  loginedUserId(state) {
    return state.userAbout.loginedUserData.id
  },
  topicComment() {
    return state.commentAbout.topicComment
  },
  attachComments(state) {
    return state.commentAbout.attachComments
  },
  unreadNotifs(state) {
    return state.notifications.reduce((preVal, notif) => {
      return preVal + !notif.isRead
    }, 0)
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
  },
  async getNotifications(context) {
    const userId = context.getters.loginedUserId
    const { data } = await axios.get(
      `${context.state.API_URL}/notifications/${userId}`
    )

    console.log(data)

    context.commit('ADD_NOTIFICATION', data)
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
    state.toastType = ''
    state.toastDetail = ''
    state.toastType = toast.type
    state.toastDetail = toast.detail
    state.isToastShow = true

    window.timer = setTimeout(() => {
      state.isToastShow = false
    }, 5300)
    console.log(window.timer)
  },
  TOGGLE_CHAT(state, roomId) {
    state.isChatRoomOn = !state.isChatRoomOn
    state.chatRoomId = roomId
  },
  ADD_NOTIFICATION(state, notification) {
    if (notification instanceof Array)
      return state.notifications.unshift(...notification)
    state.notifications.unshift(notification)
  },
  TURN_NOTIF_READ(state, notifId) {
    const targetNotif = state.notifications.find(
      (notif) => notif.id === notifId
    )
    targetNotif.isRead = true
    // TODO: DB 同步待處理，不要一次次 request，決定個時間點一次性同步
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
