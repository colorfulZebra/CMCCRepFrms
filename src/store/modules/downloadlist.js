const state = {
  tobelist: []
}

const getters = {
  getDownloadList: (state) => {
    return state.tobelist
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
      state.tobelist.map(tel => {
        if (tel.setname === table.setname && tel.name === table.name) flag = true
      })
      if (!flag) state.tobelist.push(table)
    }
  },
  removeTable: (state, table) => {
    if (typeof table.setname === 'string' && typeof table.name === 'string') {
      let ridx = -1
      for (let idx = 0; idx < state.tobelist.length; idx++) {
        if (state.tobelist[idx].setname === table.setname && state.tobelist[idx].name === table.name) {
          ridx = idx
          break
        }
      }
      state.tobelist.splice(ridx, 1)
    }
  },
  clearList: (state) => {
    state.tobelist = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
