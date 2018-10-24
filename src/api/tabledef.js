const axios = require('axios')
const baseUrlRowDef = 'http://localhost:9000/api/rowtype'
const baseUrlIndicator = 'http://localhost:9000/api/indicator'
const restRowType = {
  queryAll: `${baseUrlRowDef}/query`
}
const restIndicator = {
  queryAll: `${baseUrlIndicator}/query`
}

export default {
  getRowTypes () {
    return new Promise((resolve, reject) => {
      axios.get(restRowType.queryAll).then((data) => {
        if (data.data.result === true) {
          let rowTypeArr = []
          let restData = data.data.data
          if (Array.isArray(restData)) {
            restData.map(el => {
              let haveFlag = false
              rowTypeArr.map(rtel => {
                if (rtel.value === el.type) {
                  haveFlag = true
                  rtel.children.push({value: el.name, label: el.name})
                }
              })
              if (!haveFlag) {
                rowTypeArr.push({label: el.type, value: el.type, children: [{ value: el.name, label: el.name }]})
              }
            })
            rowTypeArr.map(rel => {
              let chNames = rel.children.map(cel => cel.value)
              rel.children.push({label: '全部', value: chNames.join('@')})
            })
            resolve(rowTypeArr)
          } else {
            resolve([])
          }
        } else {
          reject(data.data.data)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getColumns () {
    return new Promise((resolve, reject) => {
      axios.get(restIndicator.queryAll).then((data) => {
        if (data.data.result === true) {
          let colTypeArr = []
          let restData = data.data.data
          if (Array.isArray(restData)) {
            restData.map(el => {
              let flag = false
              colTypeArr.map(cel => {
                if (cel.value === el.type) {
                  flag = true
                  cel.children.push({ value: el.name, label: el.name })
                }
              })
              if (!flag) {
                colTypeArr.push({ label: el.type, value: el.type, children: [ { value: el.name, label: el.name } ] })
              }
            })
            resolve(colTypeArr)
          } else {
            resolve([])
          }
        } else {
          reject(data.data.data)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
