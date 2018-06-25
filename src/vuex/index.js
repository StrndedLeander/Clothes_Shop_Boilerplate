import Vuex from 'vuex'
import Vue from 'vue'
import sale from './modules/sale'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        sale: sale,
        user: user
    },
    state:{

    },
    getters:{

    },
    actions:{

    },
    mutations:{

    }
  
})
