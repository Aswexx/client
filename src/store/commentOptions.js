import axios from 'axios'

function findPostAndAddComment(postArr, commentToAdd, afterAdd) {
  postArr.forEach((post) => {
    if (post.id === commentToAdd.postId) {
      post.comments.unshift(afterAdd)
      return
    }
  })
}

export const commentOptions = {
  namespaced: true,
  actions: {
    async submitComment(context, comment) {
      const result = await axios.post(
        `${context.rootState.API_URL}/comments`,
        comment
      )
      context.rootState.isModalOpened = false
      findPostAndAddComment(
        context.rootState.postAbout.showingPosts,
        comment,
        result.data
      )
      findPostAndAddComment(
        context.rootState.postAbout.userPosts,
        comment,
        result.data
      )

      context.commit('ADD_COMMENT', result.data)
    }
  },
  mutations: {
    ADD_COMMENT(state, updatedComments) {
      state.postComments = updatedComments
    }
  },
  state: {
    postComments: []
  }
}
