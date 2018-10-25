<template>
  <div id="repfrmpage">
    <el-container>
      <el-aside width="220px" v-loading="repfrmsLoading">
        <el-menu @select="selectFrm">
          <br>
          <div class="newicon" v-show="repfrms.length===0">
            <br>
            <font-awesome-icon :icon="newrepIcon"/>
            <h5>(空)</h5>
          </div>
          <el-submenu v-show="repfrms.length>0" v-for="group in repfrms" :key="group.id" :index="group.id">
            <template slot="title">
              <span class="groupmenu"><font-awesome-icon :icon="frmgroupIcon"/>&nbsp;{{ group.groupname }}</span>
            </template>
            <el-menu-item v-for="frm in group.frms" :key="frm.id" :index="group.id + '-' + frm.id">
              {{ frm.frmname }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main v-loading="frmdefLoading">
        <h1 v-show="curfrmdef.columns===undefined">
          <font-awesome-icon class="emptyicon" :icon="emptyIcon"/><br>
          <font>选择一个报表</font>
        </h1>
        <el-table v-show="curfrmdef.columns!==undefined" :data="curfrmdef.data" max-height="600">
          <el-table-column v-for="(col,idx) in curfrmdef.columns" :key="col" :prop="'col'+idx" :label="col" :fixed="idx===0"></el-table-column>
        </el-table>
        <!--
        <el-dropdown v-show="curfrmdef.columns!==undefined">
          <span class="el-dropdown-link">
            选择帐期<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>2018年1月</el-dropdown-item>
            <el-dropdown-item>2018年2月</el-dropdown-item>
            <el-dropdown-item>2018年3月</el-dropdown-item>
            <el-dropdown-item>2018年4月</el-dropdown-item>
            <el-dropdown-item>2018年5月</el-dropdown-item>
            <el-dropdown-item>2018年6月</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        -->
        <el-button-group v-show="curfrmdef.columns!==undefined && curfrmdef.data.length>0" class="table-options">
          <el-tooltip content="下载此报表" placement="bottom-end">
            <el-button type="primary" size="small" @click="downloadFrm()" plain><font-awesome-icon :icon="downloadIcon"/></el-button>
          </el-tooltip>
          <el-tooltip content="将报表加入待下载报表集合" placement="bottom-end">
            <el-button type="success" size="small" @click="addToDownload({ setname: curfrmdef.groupname, name: curfrmdef.frmname })" plain><font-awesome-icon :icon="addToDownloadIcon"/></el-button>
          </el-tooltip>
        </el-button-group>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'
import repfrm from '../api/reportforms'
import { mapGetters, mapActions } from 'vuex'
import { faFolderOpen, faThList, faFile, faDownload, faPlus } from '@fortawesome/free-solid-svg-icons'

export default {
  data () {
    return {
      repfrms: [],
      owner: '',
      repfrmsLoading: false,
      curfrmdef: {},
      frmdefLoading: false
    }
  },
  mounted () {
    this.repfrmsLoading = true
    this.owner = this.getLoginAccount()
    let userCookie = this.$cookie.get('user')
    if (!!this.owner === false && !!userCookie === true) {
      this.owner = userCookie
      this.recordAccount(userCookie)
    }
    if (this.owner.length) {
      repfrm.getFrms(this.owner).then((response) => {
        this.repfrms = response.data.groups
        this.repfrmsLoading = false
      }).catch(() => {
        this.repfrms = []
        this.$message({
          type: 'error',
          message: '获取服务器用户数据错误'
        })
        this.repfrmsLoading = false
      })
    } else {
      this.repfrmsLoading = false
      this.$message({
        message: '登录信息过期，请重新登录',
        type: 'error'
      })
      this.$router.push('/')
    }
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount']),
    ...mapActions('account', ['recordAccount']),
    ...mapActions('downloadlist', ['addToDownload']),
    selectFrm (key) {
      let groupid = key.split('-')[0]
      let groupname = ''
      let frmid = key.split('-')[1]
      let frmname = ''
      this.repfrms.map(group => {
        if (group.id === groupid) {
          groupname = group.groupname
          group.frms.map(frm => {
            if (frm.id === frmid) {
              frmname = frm.frmname
            }
          })
        }
      })
      this.frmdefLoading = true
      repfrm.getTableContent(this.owner, groupname, frmname).then((resp) => {
        resp.groupname = groupname
        resp.frmname = frmname
        this.curfrmdef = resp
        this.frmdefLoading = false
      }).catch((err) => {
        this.curfrmdef = {}
        this.$message({
          type: 'error',
          message: err.message
        })
        this.frmdefLoading = false
      })
    },
    downloadFrm () {
      repfrm.downloadTable(this.owner, this.curfrmdef.groupname, this.curfrmdef.frmname).then((resp) => {
        // window.location.href = `http://localhost:9000/${resp}`
        axios({
          url: `http://localhost:9000/download/${resp}`,
          method: 'GET',
          responseType: 'blob'
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', resp)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    }
  },
  computed: {
    emptyIcon () {
      return faFolderOpen
    },
    frmgroupIcon () {
      return faThList
    },
    newrepIcon () {
      return faFile
    },
    downloadIcon () {
      return faDownload
    },
    addToDownloadIcon () {
      return faPlus
    }
  }
}
</script>

<style lang="scss" scoped>

#repfrmpage {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  text-align: left;
  .el-container {
    width: 100%;
    height: 100%;
    .el-aside {
      height: 100%;
      .el-menu {
        height: 100%;
        .groupmenu {
          color: DarkSlateGray;
        }
        .newicon {
          color: lightgrey;
          font-size: 2.2em;
          text-align: center;
          h5 {
            font-size: 16px;
            margin-top: 0;
            padding-top: 0;
          }
        }
      }
    }
    .el-main {
      height: 100%;
      width: 100%;
      padding: 0;
      padding-top: 1px;
      margin: 0;
      h1 {
        text-align: center;
        color: Gainsboro;
        .emptyicon {
          font-size: 5em;
          margin-top: 22%;
        }
        font {
          font-size: 16px;
        }
      }
      .el-table {
        width: 100%;
      }
      .el-dropdown {
        float: left;
        margin-left: 10px;
        margin-top: 20px;
        .el-dropdown-link {
          cursor: pointer;
          color: #409EFF;
        }
      }
      .table-options {
        float: right;
        margin: {
          top: 20px;
          right: 10px;
        }
        .el-button {
          font-size: 14px;
        }
      }
    }
  }
}

</style>
