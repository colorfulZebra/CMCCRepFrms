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
          <el-table-column v-for="(col,idx) in curfrmdef.columns" :key="col.name" :prop="'col'+idx" :label="col.name" :fixed="idx===0"></el-table-column>
        </el-table>
        <el-button-group v-show="curfrmdef.columns!==undefined && curfrmdef.data.length>0" class="table-options">
          <el-tooltip content="下载此报表" placement="bottom-end">
            <el-button size="small"><font-awesome-icon :icon="downloadIcon"/></el-button>
          </el-tooltip>
          <el-tooltip content="将报表加入待下载报表集合" placement="bottom-end">
            <el-button size="small"><font-awesome-icon :icon="addToDownloadIcon"/></el-button>
          </el-tooltip>
        </el-button-group>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import repfrm from '../api/reportforms'
import frmdef from '../api/repfrmdefs'
import { mapGetters } from 'vuex'
import { faFolderOpen, faThList, faFile, faDownload, faPlus } from '@fortawesome/free-solid-svg-icons'

export default {
  data () {
    return {
      repfrms: [],
      repfrmsLoading: false,
      curfrmdef: {},
      frmdefLoading: false
    }
  },
  mounted () {
    this.repfrmsLoading = true
    repfrm.getFrms(this.getLoginAccount()).then((data) => {
      this.repfrms = data
      this.repfrmsLoading = false
    })
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount']),
    selectFrm (key) {
      this.frmdefLoading = true
      frmdef.getFrmDef(key).then((data) => {
        this.curfrmdef = data
        this.frmdefLoading = false
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
