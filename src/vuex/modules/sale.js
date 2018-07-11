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
      files: [],
      downloadURLs: [],
      frontPicture: null
    },
    sales: [],
    w_h_object: {}
  },
  getters: {
    /*Only Takes the name of files to add them to the database so a
     * reference can be created by user + saleID + image_name
     * */
    fileRefs(state) {
      if (state.currentSale.files != null) {
        let arr = state.currentSale.files
        let toPass = []
        for (let i = 0; i < arr.length; i++) {
          let ref = arr[i].name
          toPass[i] = ref
        }
        return toPass;
      }
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
      var path = ref.child(name)
      return new Promise(function (resolve, reject) {
        path.put(file).then(() => {
          dispatch('manageDownloadURL', path)
        }).catch(error => {
          console.log(error.message)
        })
      })
    },
    manageDownloadURL({
      commit,
    }, path) {
      return new Promise(function (resolve, reject) {
        path.getDownloadURL().then(url => {
          console.log(url)
          commit('pushToDownloadURLs', url)
          commit('setFrontPicture')
        }).catch(error => {
          console.log(error.message)
        })
      })
    },
    prepareSaleFiles({
      dispatch,
      state
    }) {
      let time = 0;
      if (state.currentSale.files !== []) {
        for (var i = 0; i < state.currentSale.files.length; i++) {
          dispatch('manageFile', state.currentSale.files[i])
        }
        let doIt = setInterval(() => {
          time += 1
          if (state.currentSale.downloadURLs.length == state.currentSale.files.length) {
            dispatch('createSale')
            clearInterval(doIt)
          } else if (state.currentSale.downloadURLs.length >= state.currentSale.files.length || time >= 2000) {
            alert('Your sale could not be created, there was an error')
            clearInterval(doIt)
          }
        }, 10)
      } else {
        dispatch('createSale')
        return;
      }
    },
    //Adds the Sale to the database
    createSale({
      commit,
      rootState,
      state,
      getters
    }) {
      var timestamp = new Date().toLocaleString();
      var seller = rootState.user.currentUser.email
      commit('setCreated', timestamp)
      commit('setSeller', seller)
      if (state.currentSale.files.length > 0) {
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
        }).catch(error => alert(error.message))
      } else {
        db.collection('clothes').add({
          saleID: state.currentSale.saleID,
          created: state.currentSale.created,
          seller: state.currentSale.seller,
          articleName: state.currentSale.articleName,
          description: state.currentSale.description,
          brand: state.currentSale.brand,
          price: state.currentSale.price,
        }).then(() => {
          router.push('/')
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
            if (state.currentSale.files.length > 0) {
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
            } else {
              doc.ref.update({
                saleID: state.currentSale.saleID,
                created: state.currentSale.created,
                seller: state.currentSale.seller,
                articleName: state.currentSale.articleName,
                description: state.currentSale.description,
                brand: state.currentSale.brand,
                price: state.currentSale.price,
              })
            }

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
            'saleID': doc.data().saleID,
            'seller': doc.data().seller,
            'articleName': doc.data().articleName,
            'brand': doc.data().brand,
            'description': doc.data().description,
            'price': doc.data().price,
            'imagesRefs': doc.data().imagesRefs,
            'created': doc.data().created,
            'downloadURLs': doc.data().downloadURLs,
            'frontPicture': doc.data().frontPicture
          }
          allSales.push(data)
        })
        commit('setSales', allSales)
      }, error => alert(error.message))
    }
  },
  mutations: {
    setWHObject(state, obj) {
      state.w_h_object = obj
    },
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
    },
    setFilesForUpload(state, pFiles) {
      //adds files as file object to state
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
    }
  }
}
