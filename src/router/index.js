import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'login',
    component: Login,
    props: true
  },
  {
    path: '/gameslist',
    name: 'gameslist',

    component: () => import('../views/GamesList.vue'),
    props: true
  },
  {
    path: '/gameview/:id',
    name: 'gameview',

    component: () => import('../views/GameView.vue'),
    props: true
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',

    component: () => import('../views/Leaderboard.vue'),
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router