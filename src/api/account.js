const axios = require('axios')
/*
const _accounts = [
  { account: 'admin', password: 'admin' },
  { account: 'zhi', password: 'haha' },
  { account: 'zyg', password: 'haha' }
]
*/

export default {
  login ({ account, password }) {
    /*
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
    */
    return axios.post('http://localhost:9000/api/user/login', {
      name: account,
      password
    })
  }
}
