import axios from 'axios'

export const commentOptions = {
  namespaced: true,
  actions: {
    async submitComment(context, comment) {
      const result = await axios.post(
        `${context.rootState.API_URL}/comments`,
        comment
      )
      context.rootState.isModalOpened = false
      context.commit('postAbout/ADD_COMMENT_ON_POST', result.data, {
        root: true
      })
    },
    // async addCommentOfComment(context, comment) {
    //   const result = await axios.post(
    //     `${context.rootState.API_URL}/comments`,
    //     comment
    //   )
    //   context.rootState.isModalOpened = false
    //   context.commit('postAbout/ADD_COMMENT_ON_COMMENT', result.data, {
    //     root: true
    //   })
    // },
    async getAttatchComments(context, commentId) {
      const { data } = await axios.get(
        `${context.rootState.API_URL}/comments/${commentId}`
      )
      return data
      // context.commit('ADD_ATTATCH_COMMENT', data)
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
      console.log(data)
      context.commit(
        'postAbout/UPDATE_COMMENT_LIKE_OF_POST',
        { ...commentInfoToUpdate, postId: commentInfo.postId },
        { root: true }
      )
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
    ADD_ATTATCH_COMMENT(state, attatchComments) {
      state.attatchComments = attatchComments
    }
  },
  state: {
    postComments: [],
    attatchComments: []
  }
}
