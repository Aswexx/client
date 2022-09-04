import axios from 'axios'

export const postOptions = {
  namespaced: true,
  actions: {
    async getHomePagePosts(context) {
      const { data } = await axios.get(
        `${context.rootState.API_URL}/posts/relative-posts`,
        { params: { skipPostsCount: 0 } }
      )

      context.state.showingPosts = data
    },
    async getUserPosts(context, userId) {
      try {
        const { data } = await axios.get(
          `${context.rootState.API_URL}/posts/recent/${userId}`
        )
        context.commit('SAVE_USER_POSTS', data)
      } catch (err) {
        console.error(err)
        alert('請重登')
      }
    },

    async submitNewPost(context, post) {
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
