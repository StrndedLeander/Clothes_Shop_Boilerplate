import db from 'C:/Projects/clothesstore/src/components/firebase/firebaseInit'
import firebase from 'firebase'
import router from '../../router'

export default {
  namespaced: true,
  state: {
    currentSale: {
      saleID: null,
      created: null,
      seller:null,
      articleName: null,
      description: null,
      brand: null,
      price: null,
      files: null,
      created: null
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
      console.log(id)
      commit('setSaleID', id)
    },
    uploadFile({
      state
    }, imageFile) {
      return new Promise(function (resolve, reject) {
        let ref = firebase.storage().ref()
        let file = imageFile;
        let name = 'clothes_images' + '/' + firebase.auth().currentUser.email + '/' + state.currentSale.saleID + '/' + imageFile.name
        let metadata = {
          contentType: file.type
        }
        ref.child(name).put(file, metadata).then(snapshot => {

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
      //Execute when no images were added
      var timestamp = new Date().toLocaleString();
      var seller = rootState.user.currentUser.email
      commit('setCreated', timestamp)
      commit('setSeller', seller)
      if (state.currentSale.files == null) {
        db.collection('clothes').add({
          saleID: state.currentSale.saleID,
          created: state.currentSale.created,
          seller: state.currentSale.seller,
          articleName: state.currentSale.articleName,
          description: state.currentSale.description,
          brand: state.currentSale.brand,
          price: state.currentSale.price
        }).then(() => {
          dispatch('editSale')
          router.push('/')
          commit('setStateToNull')
        }).catch(error => alert(error.message))
        //Execute when images were added
      } else {
        db.collection('clothes').add({
          saleID: state.currentSale.saleID,
          created: state.currentSale.created,
          seller: state.currentSale.seller,
          articleName: state.currentSale.articleName,
          description: state.currentSale.description,
          brand: state.currentSale.brand,
          price: state.currentSale.price,
          imagesRefs: getters.fileRefs
        }).then(() => {
          for (var i = 0; i < state.currentSale.files.length; i++) {
            dispatch('uploadFile', state.currentSale.files[i])
          }
          router.push('/')
        }).catch(error => alert(error.message))
      }
    },
    editSale() {
      db.collection('clothes').where('saleID', '==', state.currentSale.saleID).get()
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
              imagesRefs: getters.fileRefs
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
        //Get downloadURLs
        for (var i = 0; i < allSales.length; i++) {
          let id = allSales[i].id
          let seller = allSales[i].seller
          let imageNames = allSales[i].imagesRefs
          var storageRef = firebase.storage().ref('clothes_images/' + seller + '/' + id + '/');
          for (var j = 0; j < imageNames.length; j++) {
            let path = storageRef.child('/' + imageNames[j])
            //Set first picture as front picture
            if (j == 0) {
              path.getDownloadURL().then(url => {
                console.log(url)
                allSales[i].frontPicture = url
              }, error => console.log(error.message))
            }
            //add all files/images to an array
            path.getDownloadURL().then(url => {
              allSales[i].downloadURLs[j] = url
            }, error => console.log(error.message))
          }
        }
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
    },
    setSaleID(state, id) {
      state.currentSale.saleID = id
    },
    setFilesForUpload(state, pFiles) {
      //adds files as file object to state
      state.currentSale.files = []
      state.currentSale.files = pFiles
      console.log(state.currentSale.files)
    },
    setArticleName(state, name) {
      state.currentSale.articleName = name
    },
    setSeller(state,seller) {
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
    }
  }

}
