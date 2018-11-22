const axios = require('axios')
const baseUrlExcel = 'http://localhost:9000/api/excel'
const restExcel = {
  queryAll: `${baseUrlExcel}/query`,
  uploadSingleFile: `${baseUrlExcel}/record/excel`,
  uploadMultiFiles: `${baseUrlExcel}/record/folder`
}
const monthregx = /[0-9]{6}/

export default {
  queryAll: function () {
    return new Promise((resolve, reject) => {
      axios.get(restExcel.queryAll).then((docs) => {
        if (docs.data.result) {
          let rawlst = docs.data.data
          let resdata = []
          let coldata = {}
          for (let el of rawlst) {
            if (coldata[el.month]) {
              if (coldata[el.month][el.excel]) {
                coldata[el.month][el.excel].push(el.sheet)
              } else {
                coldata[el.month][el.excel] = [el.sheet]
              }
            } else {
              coldata[el.month] = {}
              coldata[el.month][el.excel] = [el.sheet]
            }
          }
          for (let m in coldata) {
            let tmpmobj = { label: m, children: [] }
            for (let e in coldata[m]) {
              let tmpeobj = { label: e, children: [] }
              for (let s of coldata[m][e]) {
                tmpeobj.children.push({ label: s })
              }
              tmpmobj.children.push(tmpeobj)
            }
            resdata.push(tmpmobj)
          }
          resolve(resdata)
        } else {
          reject(new Error(docs.data.data))
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  uploadSingleFile: function (month, path) {
    return new Promise((resolve, reject) => {
      if (monthregx.test(month) && typeof path === 'string' && path.length > 0) {

      } else {
        reject(new Error('上传单个Excel文件参数非法'))
      }
    })
  }
}
