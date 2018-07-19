<template>
  <div id="mainpage">
    <el-container>
      <el-header>
        <el-menu default-active="/main" mode="horizontal" router>
          <span style="float: left;"><img src="../assets/cmcc_logo.png"/></span>
          <el-menu-item index="/main"><font-awesome-icon class="icon" :icon="repfrmIcon"/>我的报表</el-menu-item>
          <el-menu-item index="/main/repadmin"><font-awesome-icon class="icon" :icon="configIcon"/>报表管理</el-menu-item>
          <el-dropdown style="float: right;" placement="bottom" @command="handleUserOptions">
            <span class="el-dropdown-link">
              <font-awesome-icon class="icon" :icon="userIcon"/>欢迎，{{ this.getLoginAccount() }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="changepwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="quit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { faUser, faDatabase, faEdit } from '@fortawesome/free-solid-svg-icons'
import { mapGetters, mapActions } from 'vuex'

export default {
  mounted () {
    if (!!this.getLoginAccount() === false) {
      this.$message({
        message: '登录信息过期，请重新登录',
        type: 'error'
      })
      this.$router.push('/')
    }
  },
  computed: {
    userIcon () {
      return faUser
    },
    repfrmIcon () {
      return faDatabase
    },
    configIcon () {
      return faEdit
    }
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount']),
    ...mapActions('account', ['recordAccount']),
    handleUserOptions (command) {
      if (command === 'quit') {
        this._logout()
      } else if (command === 'changepwd') {
        this._changepwd()
      } else {}
    },
    _logout () {
      this.$confirm('确定退出？', '退出系统', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.recordAccount('')
        this.$router.push('/')
      }).catch(() => {})
    },
    _changepwd () {}
  }
}
</script>

<style lang="scss" scoped>

#mainpage {
  height: 100%;
  width: 100%;

  .el-container {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    .el-header {
      padding: 0;
      margin: 0;
      margin-bottom: 1px;
      .el-menu {
        img {
          width: 120px;
          height: auto;
          margin: {
            top: 15px;
            right: 40px;
            left: 40px;
          }
        }
      }
      .el-dropdown-link {
        line-height: 60px;
        padding: {
          right: 30px;
          left: 30px;
          top: 2px;
          bottom: 2px;
        }
        margin-right: 10px;
        font-size: 1.1em;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .el-main {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
    }
    .icon {
      font-size: 1.2em;
      margin-right: 5px;
    }
  }
}

</style>
