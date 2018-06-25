import db from 'C:/Projects/clothesstore/src/components/firebase/firebaseInit'
import firebase from 'firebase'
import router from '../../router'

export default {
  namespaced: true,
  state: {
    articleName: null,
    description: null,
    brand: null,
    price: null,
    files: null,
    sales: null,
    saleID: ''
  },
  getters: {
    /*Only Takes the name of files to add them to the database so a
     * reference can be created by user + saleID + image_name
     * */
    fileRefs(state) {
      var ref;
      var arr = []
      for (var i = 0; i < state.files.length; i++) {
        ref = state.files[i].name
        arr[i] = ref
      }
      return arr;
    }
  },
  actions: {
    uploadFile({
      state
    }, imageFile,saleID) {
      return new Promise(function (resolve, reject) {
        let ref = firebase.storage().ref()
        let file = imageFile;
        let name = 'clothes_images' + '/' + firebase.auth().currentUser.email + '/' + saleID + '/' + imageFile.name
        let metadata = {
          contentType: file.type
        }
        ref.child(name).put(file, metadata).then(snapshot => {
        
        }).catch(error=>{
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
      if (state.files == null) {
        db.collection('clothes').add({
          seller: rootState.user.currentUser.email,
          articleName: state.articleName,
          description: state.description,
          brand: state.brand,
          price: state.price,
          created: timestamp
        }).then(() => {
          router.go('/')
          commit('setStateToNull')
        }).catch(error => alert(error.message))
        //Execute when images were added
      } else {
        db.collection('clothes').add({
          seller: rootState.user.currentUser.email,
          articleName: state.articleName,
          description: state.description,
          brand: state.brand,
          price: state.price,
          imagesRefs: getters.fileRefs,
          created: timestamp
        }).then(docRef => {
          // commit('setSaleID', docRef.id)
          for (var i = 0; i < state.files.length; i++) {
            dispatch('uploadFile', state.files[i],docRef.id)
          }
        }).catch(error => alert(error.message))
      }
    },
    fetchSales({
      commit,
      state,
      getters
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
            'downloadURL': [],
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
              allSales[i].downloadURL[j] = url
            }, error => console.log(error.message))
          }
        }
        commit('setSales', allSales)
      }, error => alert(error.message))
    }
  },
  mutations: {
    setStateToNull(state) {
      //All state obejects related to adding a new sale
      state.articleName = null
      state.description = null
      state.brand = null
      state.price = null
      state.files = null
    },
    setSaleID(state, id) {
      state.saleID = id
    },
    setFilesForUpload(state, pFiles) {
      //adds files as file object to state
      state.files = []
      state.files = pFiles
      console.log(state.files)
    },
    setArticleName(state, name) {
      state.articleName = name
    },
    setDescription(state, pDescription) {
      state.description = pDescription
    },
    setBrand(state, pBrand) {
      state.brand = pBrand
    },
    setPrice(state, pPrice) {
      state.price = pPrice
    },
    setSales(state, sales) {
      state.sales = sales
    }
  }

}
