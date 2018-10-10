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
            id: setid++,
            groupname: el.name,
            frms: []
          }
          for (let tabel of el.tables) {
            let tmptable = {
              id: tableid++,
              frmname: tabel.name
            }
            tmpset.frms.push(tmptable)
          }
          repfrm.data.groups.push(tmpset)
        }
        resolve(repfrm)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
