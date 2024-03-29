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
  showingSearchedPosts(state) {
    return state.postAbout.showingSearchedPosts
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
  },
}

const actions = {
  async sendChatNotification(context, receiverId) {
    const recentChatNotifTargets = context.state.recentChatNotifTargets
    const lastNotifTime = recentChatNotifTargets.get(receiverId)

    if (lastNotifTime && Date.now() - lastNotifTime <= 1000 * 60 * 30) return
    recentChatNotifTargets.set(receiverId, Date.now())

    const notifData = {
      informerId: context.state.userAbout.loginedUserData.id,
      receiverId,
      notifType: 'inviteChat'
    }
    await axios.post(
      `${context.state.API_URL}/notifications`,
      notifData
    )
  },
  async getNotifications(context) {
    const userId = context.getters.loginedUserId
    const { data } = await axios.get(
      `${context.state.API_URL}/notifications/${userId}`
    )
    context.commit('ADD_NOTIFICATION', data)
  },
  updateNotifReadState(context, notifId) {
    axios.put(`${context.state.API_URL}/notifications/${notifId}`)
    context.commit('TURN_NOTIF_READ', notifId)
  },
  async handleIOScors(context) {
    await axios.get(`${context.state.API_URL}/redirect`)
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
      return //* contents null represents try to close modal or trigger post modal
    } else if (contents.modalType === 'photo') {
      // * taking photo
      state.modalType = contents.modalType
      state.sourcePostOrComment = {}
      return
    }
    state.sourcePostOrComment = contents
    state.modalType = contents.modalType
  },
  TRIGGER_TOAST(state, toast) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    if (state.isChatActivated) return
    state.toastType = toast.type
    state.toastDetail = toast.detail
    state.isToastShow = true

    this.timeoutId = setTimeout(() => {
      state.isToastShow = false
      setTimeout(() => {
        state.toastType = ''
        state.toastDetail = ''
      }, 1000)
    }, 3300)
  },
  TRIGGER_CHAT(state, info) {
    if (!state.isChatActivated) state.isChatActivated = true

    // * no info means user trigger chat window via nav bar
    if (info) {
      const isInChatList =
        // * shallow copy the state to get array without __observer__
        Array.from(state.chatTargetList).find(e => e.id === info.targetUser.id)
      state.currentChatTarget = info.targetUser
      if (isInChatList) return
      state.chatTargetList.push(info.targetUser)
    }
  },
  JOIN_CHAT(state, targetId) {
    if (!state.isChatActivated) state.isChatActivated = true

    // * confirm target then render chat window
    const targetUser = Array.from(state.userAbout.users).find(user => user.id === targetId)
    if (!Array.from(state.chatTargetList).includes(targetUser)) {
      state.chatTargetList.push(targetUser)
    }
    state.currentChatTarget = targetUser
  },
  SAVE_MESSAGE(state, msgInfo) {
    // * load msg recieved while user havent login yet
    // * convert message
    const msgToAdd = {
      isSenderMsg: false,
      contents: msgInfo.message,
      createdTime: msgInfo.createdTime
    }
    state.currentMsgCollection.push(msgToAdd)
  },
  LOAD_MESSAGE(state, messages) {
    state.currentMsgCollection.push(...messages)
  },
  SET_ROOM_ID(state, roomId) {
    state.chatRoomId = roomId
  },
  SWITCH_CHAT_TARGET(state, target) {
    state.currentChatTarget = target
  },
  REMOVE_CHAT_TARGET(state, targetIndex) {
    state.chatTargetList.splice(targetIndex, 1)
    state.currentChatTarget = ''
  },
  RESET_CHAT_STATE(state) {
    state.currentMsgCollection = []
  },
  MINIMIZE_CHAT_SECTION(state) {
    state.isChatActivated = false
  },
  SET_CHAT_SOCKET(state, chatSocket) {
    state.chatSocket = chatSocket
  },
  SET_NOTIF_SOCKET(state, notifSocket) {
    state.notifSocket = notifSocket
  },
  UPDATE_ONLINE_USERS(state, users) {
    state.onlineUsers = users
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
  }
}

const state = {
  viewport: window.innerWidth,
  useDarkTheme:
    localStorage.getItem('preferDark') === null
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : localStorage.getItem('preferDark') === 'true',
  isModalOpened: '',
  isConditionUserListActivated: false,
  modalType: '',

  isToastShow: false,
  toastType: '',
  toastDetail: '',

  lastUserDetail: '',

  isIOSdevice: false,

  isChatActivated: false,
  chatRoomId: '',
  currentChatTarget: '',
  currentMsgCollection: [],
  chatTargetList: [],
  chatSocket: '',
  recentChatNotifTargets: new Map(),

  sourcePostOrComment: {},
  notifications: [],
  notifSocket: '',
  onlineUsers: new Set(),

  videoStream: '',
  snapUrl: '',
  snapFile: null
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
