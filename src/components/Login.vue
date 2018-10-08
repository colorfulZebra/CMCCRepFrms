<template>
  <div id="loginpage">
    <el-container v-loading="loading" element-loading-text="登录中">
      <el-main>
        <el-row type="flex" justify="center">
          <el-col :span="8">
            <img class="logo" src="../assets/cmcc_pic_only.jpg">
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="8">
            <h1>报表系统</h1>
          </el-col>
        </el-row>
        <el-row type="flex" class="input-line" justify="center">
          <el-col :span="8">
            <el-input v-model="login.account" @keyup.enter.native="tryLogin()" placeholder="请输入账号" clearable></el-input>
          </el-col>
        </el-row>
        <el-row type="flex" class="input-line" justify="center">
          <el-col :span="8">
            <el-input v-model="login.password" @keyup.enter.native="tryLogin()" type="password" placeholder="请输入密码" clearable></el-input>
          </el-col>
        </el-row>
        <el-row type="flex" class="input-line" justify="center">
          <el-col :span="8">
            <el-button type="primary" @click="tryLogin()">登录&nbsp;&nbsp;<font-awesome-icon :icon="loginIcon" /></el-button>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>Copyright &copy;2018</el-footer>
    </el-container>
  </div>
</template>

<script>
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import account from '../api/account'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      login: {
        account: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    ...mapActions('account', ['recordAccount']),
    tryLogin () {
      if (!this.login.account.length || !this.login.password.length) {
        this.$message({
          message: '请输入账户和密码',
          type: 'warning'
        })
      } else {
        this.loading = true
        account.login(this.login).then((response) => {
          if (!response.data.result) {
            this.$message({
              message: '账户或密码错误',
              type: 'error'
            })
          } else {
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            this.recordAccount(this.login.account)
            this.$router.push('/main')
          }
          this.loading = false
        })
      }
    }
  },
  computed: {
    loginIcon () {
      return faSignInAlt
    }
  }
}
</script>

<style lang="scss" scoped>

#loginpage {
  width: 100%;
  height: 100%;

  .el-container {
    width: 100%;
    height: 100%;
    .logo {
      width: 300px;
      height: auto;
      padding: 10px;
      margin-top: 7%;
    }

    h1 {
      font-weight: 700;
    }

    .input-line {
      margin: {
        top: 20px;
        bottom: 20px;
      }
      .el-button {
        width: 100%;
      }
    }

    .el-footer {
      background-color: whitesmoke;
      border-top: solid 1px lightgrey;
      color: dimgray;
      line-height: 60px;
    }
  }
}

</style>
