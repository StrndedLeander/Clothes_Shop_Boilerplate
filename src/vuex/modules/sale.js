import db from 'C:/Projects/clothesstore/src/components/firebase/firebaseInit'
import firebase from 'firebase'
import router from '../../router'

export default {
  namespaced: true,
  state: {
    currentSale: {
      saleID: null,
      created: null,
      seller: null,
      articleName: null,
      description: null,
      brand: null,
      price: null,
      files: null,
      downloadURLs: [],
      frontPicture: null
    },
    sales: null
  },
  getters: {
    /*Only Takes the name of files to add them to the database so a
     * reference can be created by user + saleID + image_name
     * */
    fileRefs(state) {
      var ref;
      var arr = []
      for (var i = 0; i < state.currentSale.files.length; i++) {
        ref = state.currentSale.files[i].name
        arr[i] = ref
      }
      return arr;
    }
  },

  actions: {
    generateSaleID({
      commit
    }) {
      var id = 'xxxxxxxx-xxxx-4xxx-xxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      })
      commit('setSaleID', id)
    },
    manageFile({
      dispatch,
      state
    }, imageFile) {
      var ref = firebase.storage().ref()
      var file = imageFile;
      var name = 'clothes_images' + '/' + firebase.auth().currentUser.email + '/' + state.currentSale.saleID + '/' + imageFile.name
      var metadata = {
        contentType: file.type
      }
      var path = ref.child(name)
      return new Promise(function (resolve, reject) {
        path.put(file, metadata).then(() => {
          dispatch('manageDownloadURL', path)
        }).catch(error => {
          console.log(error.message)
        })
      })
    },
    manageDownloadURL({
      commit
    }, path) {
      return new Promise(function (resolve, reject) {
        var dURL
        path.getDownloadURL().then(url => {
          dURL = url
          commit('pushToDownloadURLs', dURL)
        }).catch(error => {
          console.log(error.message)
        })
      })
    },
    //Adds the Sale to the database
    createSale({
      dispatch,
      commit,
      rootState,
      state,
      getters
    }) {
      var timestamp = new Date().toLocaleString();
      var seller = rootState.user.currentUser.email
      commit('setCreated', timestamp)
      commit('setSeller', seller)
      if (state.currentSale.files !== null) {
        for (var i = 0; i < state.currentSale.files.length; i++) {
          dispatch('manageFile', state.currentSale.files[i])
        }
        db.collection('clothes').add({
          saleID: state.currentSale.saleID,
          created: state.currentSale.created,
          seller: state.currentSale.seller,
          articleName: state.currentSale.articleName,
          description: state.currentSale.description,
          brand: state.currentSale.brand,
          price: state.currentSale.price,
          imagesRefs: getters.fileRefs,
          downloadURLs: state.currentSale.downloadURLs,
          frontPicture: state.currentSale.frontPicture
        }).then(() => {
          router.push('/')
          commit('setStateToNull')
        }).catch(error => alert(error.message))
      } else {
        db.collection('clothes').add({
          saleID: state.currentSale.saleID,
          created: state.currentSale.created,
          seller: state.currentSale.seller,
          articleName: state.currentSale.articleName,
          description: state.currentSale.description,
          brand: state.currentSale.brand,
          price: state.currentSale.price
        }).then(() => {
          router.push('/')
          commit('setStateToNull')
        }).catch(error => alert(error.message))
      }
    },
    editSale({
      state,
      getters
    }) {
      var id = state.currentSale.saleID
      db.collection('clothes').where('saleID', '==', id).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              saleID: state.currentSale.saleID,
              created: state.currentSale.created,
              seller: state.currentSale.seller,
              articleName: state.currentSale.articleName,
              description: state.currentSale.description,
              brand: state.currentSale.brand,
              price: state.currentSale.price,
              imagesRefs: getters.fileRefs,
            })
          })
        })
    },
    fetchSales({
      commit
    }) {
      var allSales = [];
      db.collection('clothes').orderBy('created').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            'id': doc.id,
            'seller': doc.data().seller,
            'articleName': doc.data().articleName,
            'brand': doc.data().brand,
            'description': doc.data().description,
            'price': doc.data().price,
            'imagesRefs': doc.data().imagesRefs,
            'created': doc.data().created,
            'downloadURLs': [],
            'frontPicture': ''
          }
          allSales.push(data)
        })
        commit('setSales', allSales)
      }, error => alert(error.message))
    }
  },
  mutations: {
    setCreated(state, time) {
      state.currentSale.created = time
    },
    setStateToNull(state) {
      //All state obejects related to adding a new sale
      state.currentSale.articleName = null
      state.currentSale.description = null
      state.currentSale.brand = null
      state.currentSale.price = null
      state.currentSale.files = null
      state.currentSale.saleID = null
      state.currentSale.seller = null
      state.currentSale.downloadURLs = []
      state.currentSale.frontPicture = null
      state.currentSale.created = null
    },
    setSaleID(state, id) {
      state.currentSale.saleID = id
      console.log(state.currentSale.saleID)
    },
    setFilesForUpload(state, pFiles) {
      //adds files as file object to state
      state.currentSale.files = []
      state.currentSale.files = pFiles
    },
    setArticleName(state, name) {
      state.currentSale.articleName = name
    },
    setSeller(state, seller) {
      state.currentSale.seller = seller
    },
    setDescription(state, pDescription) {
      state.currentSale.description = pDescription
    },
    setBrand(state, pBrand) {
      state.currentSale.brand = pBrand
    },
    setPrice(state, pPrice) {
      state.currentSale.price = pPrice
    },
    setSales(state, sales) {
      state.sales = sales
    },
    pushToDownloadURLs(state, url) {
      state.currentSale.downloadURLs.push(url)
    },
    setFrontPicture(state) {
      state.currentSale.frontPicture = state.currentSale.downloadURLs[0]
      alert(state.currentSale.downloadURLs[0])
    }
  }

}
