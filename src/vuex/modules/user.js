import db from 'C:/Projects/clothesstore/src/components/firebase/firebaseInit'
import firebase from 'firebase'
import router from '../../router'

export default {
  namespaced: true,
  state: {
    email: null,
    password: null,
    displayName: null,
    currentUser: {},
    userSite: {
      displayName: '',
      sales: []
    }
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
          var currentUser = firebase.auth().currentUser
          currentUser.updateProfile({
            displayName: state.displayName
          }).then(() => {
            alert('Thanks for registering with ' + state.email)
            commit('setLoggedIn', true)
            router.go('/login')
            commit('setToNull')
          })
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
    },

    //Manage User Information such as displayName and sales in database so it can be shown on user profile
    addUserToDB({}) {

    },
    fetchSingleUser({
      state
    }) {
      let obj = {
        displayName: '',
        sales: []
      }
      db.collection('users').where('displayName', '==', state.userSite.displayName).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            obj.displayName = doc.data().displayName
            obj.sales = doc.data().sales
          })
          commit('setUserSite', obj)
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
      state.displayName = null
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
    },
    setDisplayName(state, displayName) {
      state.displayName = displayName
    },
    setUserSite(state, information) {
      state.userSite = information
    }
  }
}
