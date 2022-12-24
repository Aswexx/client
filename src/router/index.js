import Vue from 'vue'
import VueRouter from 'vue-router'
import MainView from '../views/MainView.vue'
import HomePage from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import UserLoginPage from '../views/UserLoginPage.vue'
import AdminLoginPage from '../views/AdminLoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import SettingPage from '../views/SettingPage.vue'
import UserPostsPage from '../views/UserPostsPage.vue'
import UserRepliesPage from '../views/UserRepliesPage.vue'
import UserLikesPage from '../views/UserLikesPage.vue'
import PostDetailPage from '../views/PostDetailPage.vue'
import CommentDetailPage from '../views/CommentDetailPage.vue'
import NotificationPage from '../views/NotificationPage.vue'
import FollowshipPage from '../views/FollowshipPage.vue'
import SponsorPage from '../views/SponsorPage.vue'
import EmailVertificationPage from '../views/EmailVertificationPage.vue'
// * admin pages
import PostListPage from '../views/admin/PostListPage.vue'
import UserListPage from '../views/admin/UserListPage.vue'
import StatsPage from '../views/admin/StatsPage.vue'
// *
import store from './../store/index'
import axios from 'axios'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'primary',
    component: MainView,
    beforeEnter: async (_to, _from, next) => {
      try {
        const API_URL = store.state.API_URL
        // * 直接檢查 token + 拿登入者資料(自動登入)，進到 catch 則使用者需要輸入帳密
        const { data } = await axios.get(`${API_URL}/auth`)
        store.commit('userAbout/SAVE_USER_DATA', data)
        store.state.isAuthenticated = true
        await store.dispatch('userAbout/getUsers')
        console.log(data)
        // alert(`next to mainview, userRole: ${data.userRole}`)
        // if (data.userRole === 'normal') {
        //   next()
        // } else {
        //   next('/post-list')
        // }
        next()
      } catch (err) {
        if (store.state.userAbout.isAuthenticated) {
          alert('authenticted!')
          next()
        }
        // alert('plz login')
        next('/login')
      }
      // ****
              // const API_URL = store.state.API_URL
              // const { data } = await axios.get(`${API_URL}/auth`)
              // store.commit('userAbout/SAVE_USER_DATA', data)
              // store.state.isAuthenticated = true
              // await store.dispatch('userAbout/getUsers')
              // console.log(data)
              // // alert(`next to mainview, userRole: ${data.userRole}`)
              // // if (data.userRole === 'normal') {
              // //   next()
              // // } else {
              // //   next('/post-list')
              // // }
              // next()
              
    },
    children: [
      {
        path: 'home',
        name: 'home',
        component: HomePage
      },
      {
        path: 'profile',
        redirect: '/profile/posts',
        name: 'profile',
        component: ProfilePage,
        children: [
          {
            path: 'posts',
            name: 'posts',
            component: UserPostsPage
          },
          {
            path: 'replies',
            name: 'replies',
            component: UserRepliesPage
          },
          {
            path: 'likes',
            name: 'likes',
            component: UserLikesPage
          }
        ]
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: NotificationPage
      },
      {
        path: 'setting',
        name: 'setting',
        component: SettingPage
      },
      {
        path: 'post-detail',
        name: 'post-detail',
        component: PostDetailPage
      },
      {
        path: 'comment-detail',
        name: 'comment-detail',
        component: CommentDetailPage
      },
      {
        path: 'sponsor',
        name: 'sponsor',
        component: SponsorPage
      },
      {
        path: 'followship',
        name: 'followship',
        component: FollowshipPage
      },
      // * admin pages
      {
        path: 'post-list',
        name: 'post-list',
        component: PostListPage
      },
      {
        path: 'user-list',
        name: 'user-list',
        component: UserListPage
      },
      {
        path: 'stats',
        name: 'stats',
        component: StatsPage
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: UserLoginPage
  },
  {
    path: '/admin-login',
    name: 'admin-login',
    component: AdminLoginPage
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage
  },
  {
    path: '/email-vertification',
    name: 'email-vertification',
    component: EmailVertificationPage
  },
  {
    path: '/pay-confirmed',
    name: 'pay-confirmed',
    component: () => import('../views/PayConfirmedPage.vue')
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

// router.beforeEach((to,_from,next) => {
//   if (to.name !== 'login' && to.name !== 'admin-login' && !store.state.userAbout.isAuthenticated) {
//     alert('請先登入')
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router