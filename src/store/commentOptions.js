import axios from 'axios'

export const commentOptions = {
  namespaced: true,
  getters: {
    loginedUserId(state, getters, rootState, rootGetters) {
      return rootGetters.loginedUserId
    },
    loginedUserAvatarUrl(state, getters, rootState, rootGetters) {
      return rootGetters.loginedUser.avatarUrl
    },
  },
  actions: {
    async submitComment(context, comment) {
      const result = await axios.post(
        `${context.rootState.API_URL}/comments`,
        comment
      )

      // * update num of attachComments
      const showingPosts = context.rootState.postAbout.showingPosts
      const onCommentId = result.data.onCommentId
      if (onCommentId) {
        showingPosts.forEach((post) => {
          if (post.comments.length) {
            post.comments.forEach((comment) => {
              if (comment.id === onCommentId) {
                comment._count.commentByComments++
              }
            })
          }
        })
      }

      result.data.author.avatarUrl = this.getters.loginedUser.avatarUrl

      context.rootState.isModalOpened = false
      if (result.data.postId) {
        context.commit('postAbout/ADD_COMMENT_ON_POST', result.data, {
          root: true
        })
        return
      }

      context.commit('ADD_COMMENT_ON_ATTACH_COMMENT', result.data)
      return result.data
    },
    async getComment(context, commentId) {
      const { data } = await axios.get(
        `${context.rootState.API_URL}/comments/${commentId}`
      )
      context.commit('SET_TOPIC_COMMENT', data)
      return data
    },

    async getAttachComments(context, commentId) {
      const { data } = await axios.get(
        `${context.rootState.API_URL}/comments/${commentId}/attachComments`
      )
      context.commit('SET_ATTACH_COMMENTS', { commentId, attachComments: data })
      return data
    },

    async getUserRecentComments(context, userId) {
      const { data } = await axios.get(
        `${context.rootState.API_URL}/comments/recent/${userId}`
      )
      context.commit('SET_USER_RECENT_COMMENTS', data)
    },

    async toggleCommentLike(context, commentInfo) {
      const commentInfoToUpdate = {
        commentId: commentInfo.commentId,
        isLike: commentInfo.isLike,
        userId: context.rootState.userAbout.loginedUserData.id
      }
      const { data } = await axios.put(
        `${context.rootState.API_URL}/comments`,
        commentInfoToUpdate
      )
      if (commentInfo.postId) {
        context.commit(
          'postAbout/UPDATE_COMMENT_LIKE_OF_POST',
          { ...commentInfoToUpdate, postId: commentInfo.postId },
          { root: true }
        )
      } else {
        context.commit('UPDATE_COMMENT_LIKE_OF_COMMENT', {
          ...data,
          commentId: commentInfo.commentId
        })
      }
    },
    async deleteComment(context, commentId) {
      await axios.delete(
        `${context.rootState.API_URL}/comments/${commentId}`
      )
      context.commit('DELETE_USER_RECENT_COMMENT', commentId)
    }
  },
  mutations: {
    ADD_COMMENT(state, updatedComments) {
      for (const post of state.rootState.postAbout.showingPosts) {
        if (post.id === updatedComments.postId) {
          post.comments.unshift(updatedComments)
          return
        }
      }
    },
    SET_USER_RECENT_COMMENTS(state, comments) {
      state.userRecentComments = comments
    },
    DELETE_USER_RECENT_COMMENT(state, commentId) {
      state.userRecentComments =
        state.userRecentComments.filter(comment => comment.id !== commentId)
    },
    SET_ATTACH_COMMENTS(state, attachComments) {
      state.attachComments[attachComments.commentId] =
        attachComments.attachComments
    },
    ADD_COMMENT_ON_ATTACH_COMMENT(state, newComment) {
      const key = newComment.onCommentId
      if (!state.attachComments[key]) {
        state.attachComments[key] = []
      }
      state.attachComments[key].unshift(newComment)
    },
    RESET_ATTACH_COMMENTS(state) {
      state.attachComments = {}
    },
    SET_TOPIC_COMMENT(state, comment) {
      state.topicComment = comment
    },
    RESET_TOPIC_COMMENT(state) {
      state.topicComment = {}
    },
    SAVE_TEMP_COMMENT(state, comment) {
      state.tempComment = comment
    },
    TRACE_PARENT_COMMENTS(state, comment) {
      const index = state.parentComments.indexOf(comment)
      if (index === -1) {
        state.parentComments.push(comment)
      } else {
        state.parentComments = state.parentComments.slice(0, index + 1)
      }
    },
    RESET_PARENT_COMMENTS(state) {
      state.parentComments = []
    },
    UPDATE_COMMENT_LIKE_OF_COMMENT(state, updatedComment) {
      const topicCommentId = state.topicComment.id
      const targetAttachComments = state.attachComments[topicCommentId]
      let targetComment

      // * if user cancel like will get response data with count prop
      if (updatedComment.count) {
        targetComment = targetAttachComments.find(
          (comment) => comment.id === updatedComment.commentId
        )
        targetComment.liked = targetComment.liked.filter(
          (e) => e.user.id !== this.getters.loginedUserId
        )
        return
      }

      targetComment = targetAttachComments.find(
        (comment) => comment.id === updatedComment.commentId
      )

      targetComment.liked.push({
        user: {
          id: updatedComment.userId
        }
      })
    }
  },
  state: {
    topicComment: {},
    attachComments: {},
    parentComments: [],
    tempComment: {},
    userRecentComments: []
  }
}
