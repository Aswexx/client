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

    async getPost(context, postId) {
      return await axios.get(`${context.rootState.API_URL}/posts/${postId}`)
    },

    async submitNewPost(context, post) {
      const { data } = await axios.post(
        `${context.rootState.API_URL}/posts/`,
        post
      )

      context.commit('SAVE_NEW_POST', data)
      if (!context.rootState.isModalOpened) return
      context.commit('TOGGLE_MODAL', null, { root: true })
    },

    async deletePost(context, postId) {
      await axios.delete(`${context.rootState.API_URL}/posts/${postId}`)

      context.commit('REMOVE_POST', postId)
    },
    async togglePostLike(context, postInfo) {
      postInfo = {
        ...postInfo,
        userId: context.rootState.userAbout.loginedUserData.id
      }
      await axios.put(`${context.rootState.API_URL}/posts`, postInfo)
      context.commit('UPDATE_POST_LIKE_STATE', postInfo)
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
    },
    SAVE_TEMP_POST(state, post) {
      state.tempPost = post
    },
    ADD_COMMENT_ON_POST(state, newComment) {
      for (const post of state.showingPosts) {
        if (post.id === newComment.postId) {
          post.comments.unshift(newComment)
          return
        }
      }
    },
    UPDATE_POST_LIKE_STATE(state, likePostInfo) {
      console.log({ likePostInfo })
      if (!likePostInfo.isLike) {
        for (const post of state.showingPosts) {
          if (post.id === likePostInfo.postId) {
            const index = post.liked.indexOf(likePostInfo)
            post.liked.splice(index, 1)
            return
          }
        }
      }
      for (const post of state.showingPosts) {
        if (post.id === likePostInfo.postId) {
          post.liked.push(likePostInfo)
          return
        }
      }
    },
    UPDATE_COMMENT_LIKE_OF_POST(state, likeCommentInfo) {
      console.log({ likeCommentInfo })
      // TODO: optimize the code below
      if (!likeCommentInfo.isLike) {
        for (const post of state.showingPosts) {
          if (post.id === likeCommentInfo.postId) {
            for (const comment of post.comments) {
              if (comment.id === likeCommentInfo.commentId) {
                const index = comment.liked.indexOf(likeCommentInfo)
                comment.liked.splice(index, 1)
                return
              }
            }
          }
        }
      }
      for (const post of state.showingPosts) {
        if (post.id === likeCommentInfo.postId) {
          for (const comment of post.comments) {
            if (comment.id === likeCommentInfo.commentId) {
              comment.liked.push(likeCommentInfo)
              return
            }
          }
        }
      }
    }
  },
  state: { userPosts: [], showingPosts: [], tempPost: {} }
}
