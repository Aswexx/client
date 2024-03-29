import axios from 'axios'

function directToLoginPageAndResetSocket (context) {
  window.location.href = process.env.VUE_APP_HOST_URL
  context.rootState.notifSocket.disconnect()
  context.rootState.notifSocket = ''
}

export const postOptions = {
  namespaced: true,
  actions: {
    async getHomePagePosts(context) {
      try {
        const { data } = await axios.get(
          `${context.rootState.API_URL}/posts/home-page`,
          {
            params: { skipPostsCount: 0, take: 10, order: 'newest' }
          }
        )

        delete data.postCount
        context.state.showingPosts = Object.values(data)
      } catch (err) {
        console.error(err)
        alert('請重新登入')
        directToLoginPageAndResetSocket(context)
      }
    },

    async getUserPosts(context, userId) {
      try {
        const { data } = await axios.get(
          `${context.rootState.API_URL}/posts/recent/${userId}`
        )
        context.commit('SAVE_USER_POSTS', data)
      } catch (err) {
        alert('請嘗試重新登入')
        directToLoginPageAndResetSocket(context)
      }
    },

    async getUserLikePosts(context, userId) {
      try {
        const { data } = await axios.get(
          `${context.rootState.API_URL}/posts/likes/${userId}`
        )
        context.commit('SAVE_USER_LIKE_POSTS', data)
      } catch (err) {
        alert('請嘗試重新登入')
        directToLoginPageAndResetSocket(context)
      }
    },

    async getPost(context, postId) {
      return await axios.get(`${context.rootState.API_URL}/posts/${postId}`)
    },

    async submitNewPost(context, postInfo) {
      const { data } = await axios.post(
        `${context.rootState.API_URL}/posts/`,
        postInfo
      )

      data.author.avatarUrl =
        context.rootState.userAbout.loginedUserData.avatarUrl

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
    },

    // * Admin Page features
    async getAdminPagePosts(
      context,
      conditions = { skipPostsCount: 0, take: 10, order: 'newest' } //* DEFAULT CONDITIONS
    ) {
      const { data } = await axios.get(`${context.rootState.API_URL}/posts`, {
        params: {
          skipPostsCount: conditions.skipPostsCount,
          take: conditions.take,
          order: conditions.order,
          keyword: conditions.keyword
        }
      })

      context.state.postCount = data.postCount
      context.state.showingPosts = data
      delete data.postCount

      if (!conditions.keyword) return

      const searchedPosts = data
      const parsedData = Object.values(
        JSON.parse(JSON.stringify(searchedPosts))
      )

      context.commit('SHOW_SEARCHED_POSTS', parsedData)
    },

    async getAllPostsCreatedTime(context, dateRange) {
      const { data } = await axios.get(
        `${context.rootState.API_URL}/posts/createdTime`
      )
      const mappedData = data.map((e) => {
        return new Date(e.createdAt)
      })
      const result = mappedData.filter(
        (date) => date >= dateRange[0] && date <= dateRange[1]
      )

      // * index of chartData represents hours
      const chartData = Array.from({ length: 24 }, () => 0)
      result.forEach((date) => {
        chartData[date.getHours()]++
      })

      context.state.allPostsCreatedAt = chartData
    }
  },
  mutations: {
    SAVE_USER_POSTS(state, posts) {
      state.userPosts = [...posts]
    },
    SAVE_USER_LIKE_POSTS(state, posts) {
      state.userLikePosts = posts.map(obj => obj.post)
    },
    CONVERT_AVATAR_URL(state, avatarUrl) {
      state.userPosts.forEach((post) => {
        post.avatarUrl = avatarUrl
      })
    },
    SAVE_NEW_POST(state, post) {
      state.userPosts.unshift(post)
      state.showingPosts.unshift(post)
    },
    SHOW_SEARCHED_POSTS(state, data) {
      state.showingSearchedPosts = data
    },
    SORT_SHOWING_POSTS(state, orderRule) {
      const parsedPosts = Object.values(
        JSON.parse(JSON.stringify(state.showingPosts))
      )
      switch (orderRule) {
        case 'oldest':
          parsedPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
          break
        case 'mostComments':
          parsedPosts.sort((a, b) => b.comments.length - a.comments.length)
          break
        case 'mostLikes':
          parsedPosts.sort((a, b) => b.liked.length - a.liked.length)
          break
      }

      state.showingPosts = parsedPosts
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
      function mutatePostsLike(targetPosts) {
        if (!likePostInfo.isLike) {
          for (const post of targetPosts) {
            if (post.id === likePostInfo.postId) {
              const like = post.liked.find(
                (like) => like.userId === likePostInfo.userId
              )
              const likeIndex = post.liked.indexOf(like)
              post.liked.splice(likeIndex, 1)
              return
            }
          }
        }
        for (const post of targetPosts) {
          if (post.id === likePostInfo.postId) {
            post.liked.push(likePostInfo)
            break
          }
        }
      }

      switch (likePostInfo.currentRouteName) {
        case 'home':
          mutatePostsLike(state.showingPosts)
          break
        case 'posts':
          mutatePostsLike(state.userPosts)
          break
        case 'likes':
          mutatePostsLike(state.userLikePosts)
      }
      
    },
    UPDATE_COMMENT_LIKE_OF_POST(state, likeCommentInfo) {
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
  state: {
    userPosts: [],
    userLikePosts: [],
    showingPosts: [],
    showingSearchedPosts: [],
    tempPost: {},
    postCount: 0,
    allPostsCreatedAt: []
  }
}
