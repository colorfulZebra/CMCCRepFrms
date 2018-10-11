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
/*
const _repfrms = [
  {
    owner: 'admin',
    groups: [
      {
        id: '1',
        groupname: '流量类',
        frms: [
          { id: '1', frmname: '流量监控' },
          { id: '2', frmname: '流量份额' }
        ]
      },
      {
        id: '2',
        groupname: '收入类',
        frms: [
          { id: '3', frmname: '语音收入' },
          { id: '4', frmname: '宽带收入' },
          { id: '5', frmname: '流量收入' },
          { id: '12', frmname: '咪咕视频收入' },
          { id: '11', frmname: '终端收入' }
        ]
      },
      {
        id: '3',
        groupname: '宽带类',
        frms: [
          { id: '6', frmname: '新发展' },
          { id: '7', frmname: '魔盒' }
        ]
      },
      {
        id: '4',
        groupname: '客户类',
        frms: [
          { id: '8', frmname: '存量客户' },
          { id: '9', frmname: '新发展客户' },
          { id: '10', frmname: '4G客户' }
        ]
      }
    ]
  }
]
*/

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
  }
}
