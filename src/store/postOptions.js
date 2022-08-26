import axios from 'axios'

export const postOptions = {
  namespaced: true,
  actions: {
    async getUserPosts(context, userId) {
      const { data } = await axios.get(
        `${context.rootState.API_URL}/posts/recent/${userId}`
      )
      context.commit('SAVE_USER_POSTS', data)
    },

    async submitNewPost(context, post) {
      // const postInfo = {
      //   authorId: context.rootState.userAbout.loginedUserData.id,
      //   contents: postContents
      // }
      const { data } = await axios.post(
        `${context.rootState.API_URL}/posts/`,
        post
      )

      context.commit('SAVE_NEW_POST', data)
    },

    async deletePost(context, postId) {
      await axios.delete(`${context.rootState.API_URL}/posts/${postId}`)

      context.commit('REMOVE_POST', postId)
    }
  },
  mutations: {
    SAVE_USER_POSTS(state, posts) {
      state.userPosts = [...posts]
    },
    SAVE_NEW_POST(state, post) {
      state.userPosts.unshift(post)
      state.showingPosts.unshift(post)
    },
    REMOVE_POST(state, postId) {
      const postToRemove = state.showingPosts.find((post) => post.id === postId)
      let index = state.showingPosts.indexOf(postToRemove)
      state.showingPosts.splice(index, 1)

      if (!state.userPosts.length) return
      index = state.userPosts.indexOf(postToRemove)
      state.userPosts.splice(index, 1)
    }
  },
  state: { userPosts: [], showingPosts: [] }
}
