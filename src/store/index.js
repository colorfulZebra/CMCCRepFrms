import Vue from 'vue'
import Vuex from 'vuex'
import downloadlist from './modules/downloadlist'
import account from './modules/account'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    downloadlist,
    account
  },
  strict: debug
})
