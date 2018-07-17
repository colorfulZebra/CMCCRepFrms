const state = {
  hello: 'Hello world'
}

const getters = {
  getTheWorld: (state) => {
    return state.hello
  }
}

const actions = {
  changeTheWorldAsync: ({ commit }, newWorld) => {
    commit('changeTheWorld', newWorld)
  }
}

const mutations = {
  changeTheWorld: (state, newWorld) => {
    state.hello = newWorld
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
