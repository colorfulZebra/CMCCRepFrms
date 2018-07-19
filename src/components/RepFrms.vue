<template>
  <div id="repfrmpage">
    <el-container>
      <el-aside width="220px" v-loading="repfrmsLoading">
        <el-menu @select="selectFrm">
          <br>
          <el-submenu v-for="group in repfrms" :key="group.id" :index="group.id">
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
        <h1 v-show="curfrmdef.columns === undefined">
          <font-awesome-icon class="emptyicon" :icon="emptyIcon"/><br>
          选择一个报表
        </h1>
        <el-table v-show="curfrmdef.columns !== undefined">
          <el-table-column fixed>地市</el-table-column>
          <el-table-column v-for="col in curfrmdef.columns" :key="col.name"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import repfrm from '../api/reportforms'
import frmdef from '../api/repfrmdefs'
import { mapGetters } from 'vuex'
import { faFolderOpen, faList } from '@fortawesome/free-solid-svg-icons'

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
      return faList
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
        color: dimgray;
        .emptyicon {
          font-size: 5em;
          margin-top: 22%;
        }
      }
      .el-table {
        width: 100%;
      }
    }
  }
}

</style>
