<template>
  <div id="mainpage">
    <el-container>
      <el-header>
        <el-menu :default-active="curActivePage" mode="horizontal" router>
          <span style="float: left;"><img src="../assets/cmcc_logo.png"/></span>
          <el-menu-item index="/main"><font-awesome-icon class="icon" :icon="repfrmIcon"/>我的报表</el-menu-item>
          <el-menu-item index="/main/repadmin"><font-awesome-icon class="icon" :icon="configIcon"/>报表管理</el-menu-item>
          <el-badge class="download" :value="tobeDownload.length" :max="99">
            <el-tooltip placement="bottom-end" content="查看待下载报表集合">
              <el-button size="small" type="info" @click="dialogDownloadVisible=true" circle><font-awesome-icon :icon="downloadIcon"/></el-button>
            </el-tooltip>
          </el-badge>
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
    <el-dialog :visible.sync="dialogDownloadVisible" :close-on-click-modal="false">
      <span slot="title" class="dialog-title">待下载报表集合</span>
      <span class="dialog-body">
        <el-table stripe style="width:100%" :data="tobeDownload" max-height="370">
          <el-table-column label="报表名" prop="name"></el-table-column>
          <el-table-column label="报表分类" prop="group"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" style="color: Salmon;">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </span>
      <span slot="footer">
        <el-popover placement="top" width="160" v-model="emptyListVisible">
          <p>确定要清空列表？</p>
          <div style="text-align: right; margin: 0;">
            <el-button size="mini" type="text" @click="emptyListVisible = false">取消</el-button>
            <el-button type="danger" size="mini" @click="emptyListVisible = false">确定</el-button>
          </div>
          <el-button type="danger" slot="reference">清空&nbsp;<font-awesome-icon :icon="clearDownloadIcon"/></el-button>
        </el-popover>
        <el-button type="primary">下载&nbsp;<font-awesome-icon :icon="downloadActionIcon"/></el-button>
        <el-button @click="emptyListVisible=false;dialogDownloadVisible=false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { faUser, faDatabase, faEdit, faBox, faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { mapGetters, mapActions } from 'vuex'

export default {
  mounted () {
    let userCookie = this.$cookie.get('user')
    if (!!this.getLoginAccount() === false) {
      if (!!userCookie === false) {
        this.$message({
          message: '登录信息过期，请重新登录',
          type: 'error'
        })
        this.$router.push('/')
      } else {
        this.recordAccount(userCookie)
      }
    }
    let curFullPath = this.$router.currentRoute.fullPath
    if (curFullPath.indexOf('repadmin') !== -1) {
      this.$router.push('/main/repadmin')
      this.curActivePage = '/main/repadmin'
    } else if (curFullPath.indexOf('main') !== -1) {
      this.$router.push('/main')
      this.curActivePage = '/main'
    } else {
      this.$router.push('/')
    }
    // this.curActivePage = this.$router.currentRoute.fullPath
  },
  data () {
    return {
      dialogDownloadVisible: false,
      emptyListVisible: false,
      curActivePage: '',
      tobeDownload: [
        { name: '报表一', group: '收入类' },
        { name: '报表二', group: '收入类' },
        { name: '报表三', group: '流量类' },
        { name: '报表四', group: '流量类' },
        { name: '报表五', group: '收入类' },
        { name: '报表六', group: '收入类' },
        { name: '报表七', group: '客户类' },
        { name: '报表八', group: '收入类' }
      ]
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
    },
    downloadIcon () {
      return faBox
    },
    downloadActionIcon () {
      return faDownload
    },
    clearDownloadIcon () {
      return faTrashAlt
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

  .dialog-title {
    font-size: 20px;
    font-weight: 500;
  }

  .dialog-body {
    text-align: left;
  }

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
            right: 60px;
            left: 40px;
          }
        }
      }
      .el-dropdown-link {
        line-height: 60px;
        padding: {
          right: 10px;
          left: 30px;
          top: 2px;
          bottom: 2px;
        }
        margin-right: 2px;
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
    .download {
      float: right;
      margin-top: 12px;
      margin-right: 30px;
      .el-button {
        font-size: 16px;
      }
    }
  }
}

</style>
