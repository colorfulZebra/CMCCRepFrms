<template>
  <div id="repfrminfopage" v-loading="loading">
    <el-row class="info-header">
      <el-col :span="24">
        <el-popover v-model="newgroupVisible" placement="right-start">
          <el-input style="margin-bottom: 10px;" v-model="newGroupname" placeholder="请输入报表集合名"></el-input>
          <el-button type="primary" size="small" @click="newTableSet()">确定</el-button>
          <el-button type="text" size="small" @click="newgroupVisible = false">取消</el-button>
          <el-button type="primary" slot="reference" plain>新建报表集合&nbsp;<font-awesome-icon :icon="newgroupIcon"/></el-button>
        </el-popover>
      </el-col>
    </el-row>
    <div v-for="gp in groups" :key="gp.id" class="group-item">
      <h3>
        {{ gp.groupname }}
        <el-button icon="el-icon-plus" type="primary" style="font-size: 10px; padding: 5px;" @click="newRepFrm(gp.groupname)" plain>
        </el-button>
        <el-button icon="el-icon-close" type="danger" style="font-size: 10px; padding: 5px; margin-left: 0;" @click="deleteTableSet(gp.groupname)" plain>
        </el-button>
      </h3>
      <hr/>
      <el-row>
        <el-col :span="8" v-for="frm in gp.frms" :key="frm.id">
          <el-card class="frm-card-item">
            <div slot="header">
              <span>{{ frm.frmname }}</span>
              <el-dropdown szie="small" trigger="click" :hide-on-click="false" :ref="`dropdown-${gp.id}-${frm.id}`" class="frm-card-option">
                <span class="el-dropdown-link">
                  设置<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><el-button type="text">复制&nbsp;<font-awesome-icon :icon="copyIcon"/></el-button></el-dropdown-item>
                  <el-dropdown-item divided><el-button type="text" style="color: Salmon;" @click="deleteRepFrm()">删除&nbsp;<font-awesome-icon :icon="deleteIcon"/></el-button></el-dropdown-item>
                  <el-dropdown-item divided>权限管理</el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工A</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工B</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工C</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工D</el-checkbox></el-dropdown-item>
                  <el-button type="text" @click="saveHide(gp.id, frm.id)">确定</el-button><el-button type="text" @click="cancelHide(gp.id, frm.id)">取消</el-button>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <h5>表头<el-button size="small" type="text" style="margin-left:5px"><font-awesome-icon :icon="newgroupIcon"/>增加</el-button></h5>
            <draggable v-model="exampleHead" @end="onEnd">
              <el-tag v-for="head in exampleHead" :key="head.label" :type="head.type" closable @close="deleteHead()">{{ head.label }}</el-tag>
            </draggable>
            <h5>列<el-button size="small" type="text" style="margin-left:5px"><font-awesome-icon :icon="newgroupIcon"/>增加</el-button></h5>
            <el-tag @close="deleteColumn()" closable>2018年1月流量同比增幅</el-tag>
            <el-tag @close="deleteColumn()" type="success" closable>2018年2月流量同比增幅</el-tag>
            <el-tag @close="deleteColumn()" type="info" closable>2018年3月流量同比增幅</el-tag>
            <el-tag @close="deleteColumn()" type="warning" closable>2018年4月流量同比增幅</el-tag>
            <el-tag @close="deleteColumn()" closable>2018年5月流量同比增幅</el-tag>
            <el-tag @close="deleteColumn()" type="success" closable>2018年6月流量同比增幅</el-tag>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { faPlus, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons'
import repfrms from '../api/reportforms'
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data () {
    return {
      groups: [],
      owner: '',
      loading: false,
      newgroupVisible: false,
      exampleHead: [
        { type: '', label: '西安' },
        { type: 'success', label: '铜川' },
        { type: 'info', label: '咸阳' },
        { type: 'warning', label: '宝鸡' },
        { type: '', label: '渭南' },
        { type: 'success', label: '汉中' },
        { type: 'info', label: '安康' },
        { type: 'warning', label: '商洛' },
        { type: '', label: '榆林' },
        { type: 'success', label: '延安' }
      ],
      newGroupname: ''
    }
  },
  mounted () {
    this.loading = true
    this.owner = this.getLoginAccount()
    let userCookie = this.$cookie.get('user')
    if (!!this.owner === false && !!userCookie === true) {
      this.owner = userCookie
      this.recordAccount(userCookie)
    }
    if (this.owner.length) {
      repfrms.getFrms(this.owner).then((response) => {
        this.groups = response.data.groups
        this.loading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取服务器用户数据错误'
        })
        this.loading = false
      })
    } else {
      this.loading = false
      this.$message({
        message: '登录信息过期，请重新登录',
        type: 'error'
      })
      this.$router.push('/')
    }
  },
  computed: {
    newgroupIcon () {
      return faPlus
    },
    deleteIcon () {
      return faTrashAlt
    },
    copyIcon () {
      return faCopy
    }
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount']),
    ...mapActions('account', ['recordAccount']),
    refreshData () {
      if (this.owner.length) {
        repfrms.getFrms(this.owner).then((response) => {
          this.groups = response.data.groups
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '获取服务器用户数据错误'
          })
        })
      } else {
        this.$message({
          message: '登录信息过期，请重新登录',
          type: 'error'
        })
        this.$router.push('/')
      }
    },
    newTableSet () {
      this.newgroupVisible = false
      let exsitedNames = this.groups.map(gp => gp.groupname)
      this.loading = true
      repfrms.newTableSet(this.owner, this.newGroupname, exsitedNames).then((reponse) => {
        this.$message({
          type: 'success',
          message: '成功新建表集合'
        })
        this.refreshData()
        this.newGroupname = ''
        this.loading = false
      }).catch((err) => {
        this.newGroupname = ''
        this.loading = false
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    newRepFrm (groupname) {
      this.$router.push(`/main/repadmin/new/${groupname}`)
    },
    saveHide (gpid, frmid) {
      this.cancelHide(gpid, frmid)
    },
    cancelHide (gpid, frmid) {
      let dropdownObj = this.$refs[`dropdown-${gpid}-${frmid}`]
      if (dropdownObj.length && dropdownObj[0].hide) {
        dropdownObj[0].hide()
      }
    },
    deleteTableSet (name) {
      this.$confirm('此操作将删除报表集，请确定报表集合为空，继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        repfrms.deleteTableSet(this.owner, name).then((response) => {
          if (!response.data.result) {
            this.$message({
              type: 'error',
              message: response.data.data
            })
          } else {
            this.refreshData()
            // this.$router.go()
          }
          this.loading = false
        }).catch((err) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: err.message
          })
        })
      }).catch(() => {
      })
    },
    deleteRepFrm () {
      this.$confirm('此操作将删除报表，继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {})
    },
    deleteHead () {
      this.$confirm('此操作将删除报表表头，继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {})
    },
    deleteColumn () {
      this.$confirm('此操作将删除报表列，继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {})
    },
    onEnd () {
      console.log(this.exampleHead)
    }
  }
}

</script>

<style lang="scss" scoped>

#repfrminfopage {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  .info-header {
    .el-button {
      margin-top: 30px;
      margin-left: 30px;
    }
  }
  .group-item {
    margin-top: 50px;
    margin-bottom: 20px;
    h3 {
      margin-left: 30px;
      margin-bottom: 10px;
    }
    hr {
      height: 1px;
      border: none;
      border-top: solid 1px lightgrey;
      margin-left: 30px;
      margin-right: 30px;
    }
    .frm-card-item {
      width: 88%;
      margin: {
        left: 30px;
        right: 20px;
        top: 10px;
        bottom: 30px;
      }
      .frm-card-option {
        float: right;
        padding: 3px 0;
        .el-dropdown-link {
          cursor: pointer;
          color: #409EFF;
        }
      }
      h5 {
        margin: 5px;
      }
      span.el-tag {
        margin: {
          bottom: 10px;
          right: 5px;
          left: 5px;
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}

</style>
