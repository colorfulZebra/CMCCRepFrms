'use strict'

const apiIndicator = require('./indicator').default
const axios = require('axios')
const baseUrlRowDef = 'http://localhost:9000/api/rowtype'
const restRowType = {
  queryAll: `${baseUrlRowDef}/query`
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
          reject(new Error(data.data.data))
        }
      }).catch((err) => {
        reject(new Error(err))
      })
    })
  },

  getColumns () {
    return new Promise((resolve, reject) => {
      apiIndicator.queryAllIndicators().then(cols => {
        let colTypeArr = []
        cols.map(el => {
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
      }).catch(err => {
        reject(new Error(err))
      })
    })
  }
}
