const state = {
  account: ''
}

const getters = {
  getLoginAccount: (state) => {
    return state.account
  }
}

const actions = {
  recordAccount: ({ commit }, loginAccount) => {
    commit('logAccount', loginAccount)
  }
}

const mutations = {
  logAccount: (state, loginAccount) => {
    state.account = loginAccount
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
