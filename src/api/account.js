const axios = require('axios')
const baseUrlUser = 'http://localhost:9000/api/user'
const restUser = {
  login: `${baseUrlUser}/login`
}

export default {
  login ({ account, password }) {
    return new Promise((resolve, reject) => {
      if (!account.length || !password.length) {
        reject(new Error('warning#请输入账户和密码'))
      } else if (!(/^[\w_]{4,}$/.test(account) && /^\w{4,}$/.test(password))) {
        reject(new Error('warning#用户名为4位以上数字、字母或下划线，密码为4位以上数字或字母'))
      } else {
        axios.post(restUser.login, { name: account, password }).then((response) => {
          if (!response.data.result) {
            reject(new Error('error#账户或密码错误'))
          } else {
            resolve(response.data)
          }
        }).catch((err) => {
          reject(new Error(`error#${err}`))
        })
      }
    })
  }
}
