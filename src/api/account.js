'use strict'

const axios = require('axios')
const baseUrlUser = 'http://localhost:9000/api/user'
const restUser = {
  login: `${baseUrlUser}/login`,
  changepwd: `${baseUrlUser}/change`
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
            if (response.data.data) {
              reject(new Error(`error#${response.data.data}`))
            } else {
              reject(new Error('error#账户或密码错误'))
            }
          } else {
            resolve(response.data)
          }
        }).catch((err) => {
          reject(new Error(`error#${err}`))
        })
      }
    })
  },

  checkPwd (account, password) {
    return new Promise((resolve, reject) => {
      if (!account.length || !password.length) {
        reject(new Error('账户密码错误'))
      } else {
        axios.post(restUser.login, { name: account, password }).then((resp) => {
          if (!resp.data.result) {
            reject(new Error('账户密码错误'))
          } else {
            resolve(resp.data.result)
          }
        }).catch(() => {
          reject(new Error('服务器问题，无法验证密码'))
        })
      }
    })
  },

  changePwd (account, oldpwd, newpwd, repeatpwd) {
    return new Promise((resolve, reject) => {
      if (account && account.length &&
          oldpwd && oldpwd.length &&
          newpwd && newpwd.length &&
          repeatpwd && repeatpwd.length) {
        if (newpwd !== repeatpwd) {
          reject(new Error('新密码和重复密码不一致'))
        } else if (!/^\w{6,}$/.test(newpwd)) {
          reject(new Error('新密码长度必须大于等于6位，包含数字和字母'))
        } else {
          axios.post(restUser.changepwd, { name: account, password: oldpwd, newpassword: newpwd }).then((resp) => {
            if (resp.data.result) {
              resolve(resp)
            } else {
              reject(new Error(resp.data.data))
            }
          }).catch((err) => {
            reject(new Error(err))
          })
        }
      } else {
        reject(new Error('新密码和重复密码不能为空'))
      }
    })
  }
}
