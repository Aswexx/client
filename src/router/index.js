import Vue from 'vue'
import VueRouter from 'vue-router'
import MainView from '../views/MainView.vue'
import HomePage from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import UserLoginPage from '../views/UserLoginPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import SettingPage from '../views/SettingPage.vue'
import UserPostsPage from '../views/UserPostsPage.vue'
import UserRepliesPage from '../views/UserRepliesPage.vue'
import UserLikesPage from '../views/UserLikesPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'primary',
    component: MainView,
    children: [
      {
        path: 'home',
        name: 'home',
        component: HomePage
      },
      {
        path: 'profile',
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
          },
        ]
      },
      {
        path: 'setting',
        name: 'setting',
        component: SettingPage
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: UserLoginPage,
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
  },
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
  routes
})

export default router
