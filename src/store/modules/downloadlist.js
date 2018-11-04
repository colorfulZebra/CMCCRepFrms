const state = {
  tablelist: []
}

const getters = {
  getDownloadList: (state) => {
    return state.tablelist
  }
}

const actions = {
  addToDownload: ({ commit }, table) => {
    commit('addTable', table)
  },
  removeFromDownload: ({ commit }, table) => {
    commit('removeTable', table)
  },
  emptyDownload: ({ commit }) => {
    commit('clearList')
  }
}

const mutations = {
  addTable: (state, table) => {
    if (typeof table.setname === 'string' && typeof table.name === 'string') {
      let flag = false
      state.tablelist.map(tel => {
        if (tel.setname === table.setname && tel.name === table.name) flag = true
      })
      if (!flag) state.tablelist.push(table)
    }
  },
  removeTable: (state, table) => {
    if (typeof table.setname === 'string' && typeof table.name === 'string') {
      let ridx = -1
      for (let idx = 0; idx < state.tablelist.length; idx++) {
        if (state.tablelist[idx].setname === table.setname && state.tablelist[idx].name === table.name) {
          ridx = idx
          break
        }
      }
      state.tablelist.splice(ridx, 1)
    }
  },
  clearList: (state) => {
    state.tablelist = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
