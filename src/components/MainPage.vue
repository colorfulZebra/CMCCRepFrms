<template>
  <div id="mainpage">
    <el-container>
      <el-header>
        <el-menu :default-active="curActivePage" mode="horizontal" router>
          <span style="float: left;"><img src="../assets/cmcc_logo.png"/></span>
          <el-menu-item index="/main"><font-awesome-icon class="icon" :icon="repfrmIcon"/>我的报表</el-menu-item>
          <el-menu-item index="/main/repadmin"><font-awesome-icon class="icon" :icon="configIcon"/>报表管理</el-menu-item>
          <el-menu-item index="/main/upload"><font-awesome-icon class="icon" :icon="uploadIcon"/>数据导入</el-menu-item>
          <el-menu-item index="/main/indicator"><font-awesome-icon class="icon" :icon="indicatorIcon"/>自定义指标</el-menu-item>
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
          <el-table-column label="报表分类" prop="setname"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" style="color: Salmon;" @click="removeDownloadItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </span>
      <span slot="footer">
        <el-popover placement="top" width="160" v-model="emptyListVisible">
          <p>确定要清空列表？</p>
          <div style="text-align: right; margin: 0;">
            <el-button size="mini" type="text" @click="emptyListVisible = false">取消</el-button>
            <el-button type="danger" size="mini" @click="dlgEmptyDownloadList()">确定</el-button>
          </div>
          <el-button type="danger" slot="reference">清空&nbsp;<font-awesome-icon :icon="clearDownloadIcon"/></el-button>
        </el-popover>
        <el-button type="primary" @click="downloadAll()" :disabled="tobeDownload.length===0">下载&nbsp;<font-awesome-icon :icon="downloadActionIcon"/></el-button>
        <el-button @click="emptyListVisible=false;dialogDownloadVisible=false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogChangePwd" width="35%" :close-on-click-modal="false">
      <span slot="title" class="dialog-title">修改密码</span>
      <div style="margin: 10px"></div>
      <el-form label-position="right" label-width="20%" :model="dlgChangePwd">
        <el-form-item label="旧密码">
          <el-input v-model="dlgChangePwd.oldpwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="dlgChangePwd.newpwd"></el-input>
        </el-form-item>
        <el-form-item label="重复密码">
          <el-input v-model="dlgChangePwd.repeatpwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span style="float:left; color:red; text-align:left; width:60%">{{ dlgChangePwdMsg }}</span>
        <el-button type="primary" @click="changePWD()">确定</el-button>
        <el-button @click="dialogChangePwd = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { faUser, faDatabase, faEdit, faBox, faDownload, faTrashAlt, faUpload, faSitemap } from '@fortawesome/free-solid-svg-icons'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import account from '../api/account'
import repfrm from '../api/reportforms'

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
    this.account = this.getLoginAccount()
    this.tobeDownload = this.getDownloadList()
    let curFullPath = this.$router.currentRoute.fullPath
    if (curFullPath.indexOf('repadmin') !== -1) {
      this.$router.push('/main/repadmin')
      this.curActivePage = '/main/repadmin'
    } else if (curFullPath.indexOf('upload') !== -1) {
      this.$router.push('/main/upload')
      this.curActivePage = '/main/upload'
    } else if (curFullPath.indexOf('main') !== -1) {
      this.$router.push('/main')
      this.curActivePage = '/main'
    } else {
      this.$router.push('/')
    }
  },
  data () {
    return {
      account: '',
      dialogDownloadVisible: false,
      dialogChangePwd: false,
      dlgChangePwdMsg: '',
      dlgChangePwd: {
        oldpwd: '',
        newpwd: '',
        repeatpwd: ''
      },
      emptyListVisible: false,
      curActivePage: '',
      tobeDownload: []
    }
  },
  computed: {
    userIcon () {
      return faUser
    },
    repfrmIcon () {
      return faDatabase
    },
    uploadIcon () {
      return faUpload
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
    },
    indicatorIcon () {
      return faSitemap
    }
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount']),
    ...mapActions('account', ['recordAccount']),
    ...mapGetters('downloadlist', ['getDownloadList']),
    ...mapActions('downloadlist', ['addToDownload']),
    ...mapActions('downloadlist', ['removeFromDownload']),
    ...mapActions('downloadlist', ['emptyDownload']),
    dlgEmptyDownloadList () {
      this.emptyDownload()
      this.tobeDownload = this.getDownloadList()
      this.emptyListVisible = false
    },
    removeDownloadItem (item) {
      this.removeFromDownload(item)
      this.tobeDownload = this.getDownloadList()
    },
    downloadAll () {
      let paramTobeDownload = []
      this.tobeDownload.map(el => paramTobeDownload.push({ set: el.setname, name: el.name, transpose: el.transpose }))
      repfrm.downloadAllTables(this.account, paramTobeDownload).then((file) => {
        axios({
          url: `http://localhost:9000/download/${file}`,
          method: 'GET',
          responseType: 'blob'
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', file)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: err.message,
          duration: 6000
        })
      })
    },
    handleUserOptions (command) {
      if (command === 'quit') {
        this._logout()
      } else if (command === 'changepwd') {
        this.dlgChangePwdMsg = ''
        this.dlgChangePwd.oldpwd = ''
        this.dlgChangePwd.newpwd = ''
        this.dlgChangePwd.repeatpwd = ''
        this.dialogChangePwd = true
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
    changePWD () {
      account.checkPwd(this.account, this.dlgChangePwd.oldpwd)
        .then(() => {
          return account.changePwd(this.account, this.dlgChangePwd.oldpwd, this.dlgChangePwd.newpwd, this.dlgChangePwd.repeatpwd)
        }).then(() => {
          this.dialogChangePwd = false
        }).catch((err) => {
          this.dlgChangePwdMsg = err.message
        })
    }
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
