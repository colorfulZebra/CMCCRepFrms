const _accounts = [
  {id: '1', account: 'admin', password: 'admin'},
  {id: '2', account: 'zhi', password: 'haha'},
  {id: '3', account: 'zyg', password: 'haha'}
]

export default {
  login ({ account, password }) {
    return new Promise((resolve, reject) => {
      let flag = false
      _accounts.map(accinfo => {
        if (accinfo.account === account && accinfo.password === password) {
          flag = true
        }
      })
      setTimeout(() => {
        if (flag) {
          resolve({
            result: {
              code: 0,
              message: 'Successful login'
            }
          })
        } else {
          resolve({
            result: {
              code: 10,
              message: 'Account or password does not exist'
            }
          })
        }
      }, 1000)
    })
  }
}
