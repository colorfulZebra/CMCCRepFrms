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
                  <el-dropdown-item><el-button type="text" @click="syncTheRepfrm(gp.groupname, frm.frmname)">同步&nbsp;<font-awesome-icon :icon="syncIcon"/></el-button></el-dropdown-item>
                  <el-dropdown-item><el-button type="text" @click="copyTheRepfrm(gp.groupname, frm)">复制&nbsp;<font-awesome-icon :icon="copyIcon"/></el-button></el-dropdown-item>
                  <el-dropdown-item><el-button type="text" @click="editTheRepfrm(gp.groupname, frm.frmname)">编辑&nbsp;<font-awesome-icon :icon="editIcon"/></el-button></el-dropdown-item>
                  <el-dropdown-item divided><el-button type="text" style="color: Salmon;" @click="deleteRepFrm(gp.groupname, frm.frmname)">删除&nbsp;<font-awesome-icon :icon="deleteIcon"/></el-button></el-dropdown-item>
                  <!--
                  <el-dropdown-item divided>权限管理</el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工A</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工B</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工C</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工D</el-checkbox></el-dropdown-item>
                  <el-button type="text" @click="saveHide(gp.id, frm.id)">确定</el-button><el-button type="text" @click="cancelHide(gp.id, frm.id)">取消</el-button>
                  -->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div style="height: 380px; overflow-y: auto">
              <h5>表头<el-button size="small" type="text" style="margin-left:5px"></el-button></h5>
              <el-tag v-for="(head, idx) in frm.rows" :key="head" :type="tagColors[idx % 4]">{{ head }}</el-tag>
              <h5>列<el-button size="small" type="text" style="margin-left:5px"></el-button></h5>
              <el-tag v-for="(col, idx) in frm.columns" :key="col.label" :type="tagColors[idx % 4]">{{ col.label }}</el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-dialog :visible.sync="dialogCopyRepfrm" width="30%" :close-on-click-modal="false">
        <span slot="title" class="dialog-title">复制表</span>
        <div style="margin: 5px">
          <el-form label-position="right" label-width="20%" :model="copyInfo">
            <el-form-item label="归属集">
              <el-select style="width:100%" v-model="copyInfo.setname" placeholder="请选择">
                <el-option
                  v-for="item in copySelectedGroups"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="新表名">
              <el-input v-model="copyInfo.name"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmCopyRepfrm()" :disabled="copyInfo.name.length === 0">确定</el-button>
          <el-button @click="dialogCopyRepfrm = false">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { faPlus, faTrashAlt, faCopy, faEdit, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import repfrms from '../api/reportforms'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      groups: [],
      owner: '',
      loading: false,
      newgroupVisible: false,
      dialogCopyRepfrm: false,
      copyInfo: {
        name: '',
        setname: '',
        tabledef: {}
      },
      copySelectedGroups: [],
      tagColors: ['', 'success', 'info', 'warning'],
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
    },
    editIcon () {
      return faEdit
    },
    syncIcon () {
      return faSyncAlt
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
          message: err.message,
          duration: 6000
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
          }
          this.loading = false
        }).catch((err) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: err.message,
            duration: 6000
          })
        })
      }).catch(() => {
      })
    },
    syncTheRepfrm (groupname, tablename) {
      this.$confirm(`确定要同步表${tablename}？该操作将会更新表的所有列元素的账期，更新后账期截止到上个月。`, '说明', {
        confirmButtonText: '继续',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true
        repfrms.syncTableSet(this.owner, groupname, tablename).then(resp => {
          this.$message({
            type: 'success',
            message: '同步表账期成功'
          })
          this.refreshData()
          this.loading = false
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.message,
            duration: 5000
          })
          this.loading = false
        })
      }).catch(() => {})
    },
    copyTheRepfrm (groupname, tabledef) {
      this.copyInfo.name = ''
      this.copyInfo.setname = groupname
      this.copyInfo.tabledef = tabledef
      this.copySelectedGroups = []
      this.copySelectedGroups = this.groups.map(gp => {
        return { value: gp.groupname, label: gp.groupname }
      })
      this.dialogCopyRepfrm = true
    },
    editTheRepfrm (groupname, tablename) {
      this.$router.push(`/main/repadmin/edit/${groupname}/${tablename}`)
    },
    confirmCopyRepfrm () {
      this.loading = true
      repfrms.newTable(this.owner, this.copyInfo.setname, {
        name: this.copyInfo.name,
        rows: this.copyInfo.tabledef.rows,
        columns: this.copyInfo.tabledef.columns }).then((resp) => {
        if (resp.data.result) {
          this.$message({
            type: 'success',
            message: '复制表成功'
          })
          this.refreshData()
        } else {
          this.$message({
            type: 'error',
            message: resp.data.data,
            duration: 6000
          })
        }
        this.loading = false
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: err.message,
          duration: 6000
        })
        this.loading = false
      })
      this.dialogCopyRepfrm = false
    },
    deleteRepFrm (groupname, tablename) {
      this.$confirm('此操作将删除报表，继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        repfrms.deleteTable(this.owner, groupname, tablename).then((resp) => {
          this.loading = false
          if (resp.data.result) {
            this.$message({
              type: 'success',
              message: '删除表成功'
            })
            this.refreshData()
          } else {
            this.$message({
              type: 'error',
              message: resp.data.data,
              duration: 6000
            })
          }
        }).catch((err) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: err.message,
            duration: 6000
          })
        })
      }).catch(() => {
      })
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
      }
    }
  }
}

</style>
