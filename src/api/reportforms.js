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

export default {

  getFrms (owner) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (let info of _repfrms) {
          if (info.owner === owner) {
            resolve(info.groups)
          }
        }
        resolve([])
      }, 1000)
    })
  }
}
