import db from 'C:/Projects/clothesstore/src/components/firebase/firebaseInit'
import firebase from 'firebase'
import router from '../../router'

export default {
  namespaced: true,
  state: {
    email: null,
    password: null,
    currentUser: {}
  },
  getters: {
    loggedIn() {
      if (firebase.auth().currentUser) {
        return true
      } else {
        return false
      }
    },
  },
  actions: {
    register({
      commit,
      state
    }) {
      firebase.auth().createUserWithEmailAndPassword(state.email, state.password)
        .then(user => {
          alert('Thanks for registering with ' + state.email)
          commit('setLoggedIn', true)
          router.go('/login')
          commit('setToNull')
        }, error => alert(error.message))
    },
    login({
      commit,
      state
    }) {
      firebase.auth().signInWithEmailAndPassword(state.email, state.password)
        .then(user => {
          alert('You are now logged in as ' + state.email)
          commit('setLoggedIn', true)
          commit('setCurrentUser')
          router.go('/')
          commit('setToNull')
        })
        .catch(error => alert(error.message))
    },
    logout({
      commit,
      state
    }) {
      firebase.auth().signOut().then(() => {
        router.go('/')
        commit('setNoUser')
      })
    }
  },
  mutations: {
    setLoggedIn(getters, bool) {
      getters.loggedIn = bool
    },
    setToNull(state) {
      state.email = null
      state.password = null
    },
    setNoUser(state) {
      state.currentUser = {}
    },
    setCurrentUser(state) {
      state.currentUser = firebase.auth().currentUser
    },
    setPassword(state, password) {
      state.password = password
    },
    setEmail(state, email) {
      state.email = email
    }
  }
}
