import Vue from 'vue'
import Router from 'vue-router'
import CreateSale from '@/components/CreateSale'
import ViewSale from '@/components/ViewSale'
import Login from '@/components/Login'
import Register from '@/components/Register'
import UserProfile from '@/components/UserProfile'
import Home from '@/components/Home'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  mode: "history",
  routes: [{
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        home: true
      }
    },
    {
      path: '/new_sale',
      name: 'createSale',
      component: CreateSale,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sale/:displayName/:id',
      name: 'viewSale',
      component: ViewSale,
      meta: {
        viewSale: true
      }
    },
    {
      path: '/user/:displayName',
      name: 'userProfile',
      component: UserProfile,
      meta: {
        userProfile: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresGuest: true
      }
    }
  ]
})

//Nav Guards
router.beforeEach((to, from, next) => {
  //Check for requiredAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //Check if !loggedIn
    if (!firebase.auth().currentUser) {
      //Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      //Proceed to route
      next()
    }
    //Check for requiredGuest guard
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    //Check if loggedIn
    if (firebase.auth().currentUser) {
      //Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      //Proceed to route
      next()
    }
  } else {
    next()
  }
})

export default router
