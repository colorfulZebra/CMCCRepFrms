const axios = require('axios')
const baseUrlRepfrm = 'http://localhost:9000/api/repfrm'
const restRepfrm = {
  queryByOwner: function (owner) {
    return `${baseUrlRepfrm}/query/${owner}`
  },
  newTableSet: `${baseUrlRepfrm}/set/new`,
  deleteTableSet: `${baseUrlRepfrm}/set/delete`,
  renameTableSet: `${baseUrlRepfrm}/set/rename`,
  newTable: `${baseUrlRepfrm}/table/new`,
  deleteTable: `${baseUrlRepfrm}/table/delete`,
  genTable: function (owner, set, table) {
    return `${baseUrlRepfrm}/table/gen?name=${set}&table=${table}&owner=${owner}`
  },
  genAllTables: `${baseUrlRepfrm}/table/genall`,
  downloadTable: function (owner, set, table) {
    return `${baseUrlRepfrm}/table/download?name=${set}&table=${table}&owner=${owner}`
  },
  downloadAllTables: `${baseUrlRepfrm}/table/downloadall`,
  renameTable: `${baseUrlRepfrm}/table/rename`
}

export default {

  getFrms (owner) {
    return new Promise((resolve, reject) => {
      if (owner.length === 0) {
        reject(new Error('登录信息丢失，请重新登录'))
      } else {
        axios.get(restRepfrm.queryByOwner(owner)).then((response) => {
          let setid = 1
          let tableid = 1
          let repfrm = {}
          repfrm.data = {
            owner,
            groups: []
          }
          for (let el of response.data.data) {
            let tmpset = {
              id: setid.toString(),
              groupname: el.name,
              frms: []
            }
            for (let tabel of el.tables) {
              let tmptable = {
                id: tableid.toString(),
                frmname: tabel.name
              }
              tmpset.frms.push(tmptable)
              tableid += 1
            }
            repfrm.data.groups.push(tmpset)
            setid += 1
          }
          resolve(repfrm)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  },

  newTableSet (owner, name, exsitedNames) {
    return new Promise((resolve, reject) => {
      if (owner.length === 0) {
        reject(new Error('请指定表集合所有者'))
      } else if (!/^[\u4e00-\u9fa5\d_]{2,}$/.test(name)) {
        reject(new Error('表集合名必须为两位以上汉字、数字或者下划线'))
      } else if (exsitedNames.includes(name)) {
        reject(new Error('表集合已存在，请重新命名'))
      } else {
        axios.post(restRepfrm.newTableSet, { owner, name }).then((response) => {
          resolve(response)
        }).catch((err) => {
          reject(new Error(err))
        })
      }
    })
  },

  deleteTableSet (owner, name) {
    return new Promise((resolve, reject) => {
      if (owner.length === 0) {
        reject(new Error('请指定待删除表集合所有着'))
      } else if (!/^[\u4e00-\u9fa5\d_]{2,}$/.test(name)) {
        reject(new Error('待删除表集合名称非法'))
      } else {
        axios.delete(restRepfrm.deleteTableSet, { data: { owner, name } }).then((response) => {
          resolve(response)
        }).catch((err) => {
          reject(new Error(err))
        })
      }
    })
  },

  newTable (owner, setname, tabledef) {
    return new Promise((resolve, reject) => {
      if (owner && owner.length !== 0 &&
          setname && setname.length !== 0 &&
          tabledef && tabledef.name &&
          Array.isArray(tabledef.rows) && Array.isArray(tabledef.columns)) {
        axios.put(restRepfrm.newTable, { owner, name: setname, table: tabledef }).then((response) => {
          resolve(response)
        }).catch((err) => {
          reject(new Error(err))
        })
      } else {
        reject(new Error('创建表信息非法'))
      }
    })
  },

  deleteTable (owner, setname, tablename) {
    return new Promise((resolve, reject) => {
      if (owner && owner.length !== 0 &&
          setname && setname.length !== 0 &&
          tablename && tablename.length !== 0) {
        axios.delete(restRepfrm.deleteTable, { data: { owner, name: setname, table: tablename } }).then((resp) => {
          resolve(resp)
        }).catch((err) => {
          reject(new Error(err))
        })
      } else {
        reject(new Error('删除表信息非法'))
      }
    })
  }
}
