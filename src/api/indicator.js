'use strict'

const axios = require('axios')
const baseIndicatorUrl = 'http://localhost:9000/api/indicator'
const basePixelUrl = 'http://localhost:9000/api/pixel'

const restIndicator = {
  queryAll: `${baseIndicatorUrl}/query`,
  newIndicator: `${baseIndicatorUrl}/new`
}

const restPixel = {
  queryAll: `${basePixelUrl}/query`,
  newPixel: `${basePixelUrl}/new`
}

export default {

  queryAllPixels () {
    return new Promise((resolve, reject) => {
      axios.get(restPixel.queryAll).then((data) => {
        if (data.data.result === true) {
          resolve(data.data)
        } else {
          reject(new Error(data.data.data))
        }
      }).catch((err) => {
        reject(new Error(err))
      })
    })
  },

  newPixel (name, excel, sheet, keywords, rowindex) {
    return new Promise((resolve, reject) => {
      if (typeof name === 'string' &&
          typeof excel === 'string' &&
          typeof sheet === 'string' &&
          typeof keywords === 'string' &&
          typeof rowindex === 'number') {
        axios.post(restPixel.newPixel, { name, excel, sheet, keywords, rowindex }).then(doc => {
          if (doc.data.result) {
            resolve(doc.data.data)
          } else {
            reject(new Error(doc.data.data))
          }
        }).catch(err => {
          reject(new Error(err))
        })
      } else {
        reject(new Error('新建原子指标参数非法'))
      }
    })
  },

  queryAllIndicators () {
    return new Promise((resolve, reject) => {
      axios.get(restIndicator.queryAll).then((data) => {
        if (data.data.result === true) {
          // let colTypeArr = []
          let restData = data.data.data
          if (Array.isArray(restData)) {
            resolve(restData)
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

  formatAllIndicators () {
    return new Promise((resolve, reject) => {
      this.queryAllPixels().then(pixs => {
        this.queryAllIndicators().then(docs => {
          let pixdict = {}
          pixs.data.map(px => {
            pixdict[px.name] = `<${px.excel}>/#${px.sheet}#/"${px.keywords}"`
          })
          let formatted = {}
          docs.map(el => {
            if (formatted[el.type]) {
              if (el.name === el.rule) {
                formatted[el.type].push({ name: el.name, rule: el.rule, pixel: pixdict[el.name] })
              } else {
                formatted[el.type].push({ name: el.name, rule: el.rule })
              }
            } else {
              formatted[el.type] = []
              if (el.name === el.rule) {
                formatted[el.type].push({ name: el.name, rule: el.rule, pixel: pixdict[el.name] })
              } else {
                formatted[el.type].push({ name: el.name, rule: el.rule })
              }
            }
          })
          let res = []
          for (let tp in formatted) {
            res.push({ name: tp, indicators: formatted[tp] })
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
    })
  },

  newIndicator (type, name, rule) {
    return new Promise((resolve, reject) => {
      if (typeof type === 'string' &&
          typeof name === 'string' &&
          typeof rule === 'string') {
        axios.post(restIndicator.newIndicator, { type, name, rule }).then(doc => {
          if (doc.data.result) {
            resolve(doc.data.data)
          } else {
            reject(new Error(doc.data.data))
          }
        }).catch(err => {
          reject(new Error(err))
        })
      } else {
        reject(new Error('新建计算指标参数非法'))
      }
    })
  }

}
