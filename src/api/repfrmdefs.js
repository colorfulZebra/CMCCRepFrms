const _frmdefs = [
  {
    id: '1',
    rows: [
      { name: '西安' },
      { name: '铜川' },
      { name: '咸阳' },
      { name: '宝鸡' },
      { name: '渭南' },
      { name: '汉中' },
      { name: '安康' },
      { name: '商洛' },
      { name: '榆林' },
      { name: '延安' }
    ],
    columns: [
      { name: '地市' },
      { name: '2018年1月流量同比增幅' },
      { name: '2018年2月流量同比增幅' },
      { name: '2018年3月流量同比增幅' },
      { name: '2018年4月流量同比增幅' },
      { name: '2018年5月流量同比增幅' },
      { name: '2018年6月流量同比增幅' },
      { name: '2018年7月流量同比增幅' }
    ],
    data: [
    ]
  }
]

function nextRandom (minVal, maxVal) {
  let minfloor = Math.floor(minVal)
  let maxfloor = Math.floor(maxVal)
  return Math.floor(Math.random() * (maxfloor - minfloor)) + minfloor
}

export default {

  getFrmDef (id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let idx = id.indexOf('-')
        if (idx < 0) {
          resolve({ rows: [], columns: [] })
        } else {
          for (let def of _frmdefs) {
            if (def.id === id.slice(idx + 1)) {
              def.data = []
              for (let r of def.rows) {
                let tmp = { col0: r.name }
                for (let i = 0; i < def.columns.length; i++) {
                  tmp[`col${i + 1}`] = nextRandom(10, 90)
                }
                def.data.push(tmp)
              }
              resolve(def)
            }
          }
          resolve({ rows: [], columns: [], data: [] })
        }
      }, 1000)
    })
  }

}
