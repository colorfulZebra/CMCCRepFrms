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
      { name: '2018年1月流量同比增幅' },
      { name: '2018年2月流量同比增幅' },
      { name: '2018年3月流量同比增幅' },
      { name: '2018年4月流量同比增幅' },
      { name: '2018年5月流量同比增幅' },
      { name: '2018年6月流量同比增幅' },
      { name: '2018年7月流量同比增幅' }
    ]
  }
]

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
              resolve(def)
            }
          }
          resolve({ rows: [], columns: [] })
        }
      }, 1000)
    })
  }

}
