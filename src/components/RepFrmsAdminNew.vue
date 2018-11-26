<template>
  <div id="repfrmnew" v-loading="loading">
    <el-steps :active="active" finish-status="success">
      <el-step title="1,定义报表表头"></el-step>
      <el-step title="2,定义报表列"></el-step>
      <el-step title="3,汇总确认"></el-step>
    </el-steps>
    <div class="control-btns">
      <el-button type="info" size="small" @click="back" plain>放弃新建报表</el-button>
      <el-button :type="nextBtn.type" size="small" @click="next" plain>{{ nextBtn.text }}<font-awesome-icon :icon="nextIcon" v-show="active < 2"/></el-button>
      <el-button type="primary" size="small" @click="prev" :disabled="active === 0" plain><font-awesome-icon :icon="prevIcon"/>上一步</el-button>
    </div>
    <div class="step-panel" v-show="active === 0">
      <br>
      <h3>定义表名</h3>
      <el-row>
        <el-col :span="9">
          <el-input v-model="repfrmname" placeholder="请输入表名"></el-input>
        </el-col>
      </el-row>
      <br>
      <h3>定义表头</h3>
      <el-row>
        <el-col :span="8">
          <el-cascader :options="headOptions" v-model="newhead" @change="newHeadChanged" clearable></el-cascader>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" :disabled="checkNewHead" @click="addNewHead()" plain><font-awesome-icon :icon="addIcon"/></el-button>
        </el-col>
      </el-row>
      <h5>已定义表头</h5><hr>
      <el-row>
        <el-col :span="24" v-show="newheads.length === 0">(空)</el-col>
        <el-col :span="24" v-show="newheads.length > 0">
          <draggable v-model="newheads">
            <el-tag v-for="(nh, idx) in newheads" :key="nh" :type="tagColors[idx % 4]" closable @close="deleteNewHead(idx)">{{ nh }}</el-tag>
          </draggable>
        </el-col>
      </el-row>
    </div>
    <div class="step-panel" v-show="active === 1">
      <br>
      <h3>定义列</h3>
      <el-row>
        <el-col :span="8">
          <el-cascader :options="columnOptions" v-model="newcolumn" clearable></el-cascader>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" :disabled="checkNewColumn" @click="addNewColumn()" plain><font-awesome-icon :icon="addIcon"/></el-button>
        </el-col>
      </el-row>
      <h5>已定义列</h5><hr>
      <el-row>
        <el-col :span="24" v-show="newcolumns.length === 0">(空)</el-col>
        <el-col :span="24" v-show="newcolumns.length > 0">
          <el-tag v-for="(nc, idx) in newcolumns" :key="nc.label" :type="tagColors[idx % 4]" closable @close="deleteNewColumn(idx)">{{ nc.label }}</el-tag>
        </el-col>
      </el-row>
    </div>
    <div class="step-panel" v-show="active === 2">
      <br>
      <h3>{{ repfrmname }}</h3>
      <el-table :data="templateTable" border>
        <el-table-column prop="head" :label="newheadtype"></el-table-column>
        <el-table-column v-for="(c, idx) in newcolumns" :key="c.label" :prop="`col${idx}`" :label="c.label"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { faArrowLeft, faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import draggable from 'vuedraggable'
import tabledef from '../api/tabledef'
import repfrm from '../api/reportforms'

export default {
  components: {
    draggable
  },
  data () {
    return {
      owner: '',
      active: 0,
      loading: false,
      tagColors: ['', 'success', 'info', 'warning'],
      monthTags: [],
      repfrmname: '',
      headOptions: [],
      newheadtype: '',
      newhead: [],
      newheads: [],
      newcolumn: [],
      newcolumns: [],
      columntypes: [],
      columnOptions: [],
      templateTable: []
    }
  },
  props: ['tableset'],
  mounted () {
    this.owner = this.getLoginAccount()
    let tmpMonth = `${moment().format('YYYY')}01`
    let curMonth = '201809'
    // let curMonth = moment().format('YYYYMM')
    while (tmpMonth !== curMonth) {
      this.monthTags.push(tmpMonth)
      tmpMonth = moment(tmpMonth, 'YYYYMM').add(1, 'month').format('YYYYMM')
    }
    Promise.all([tabledef.getRowTypes(), tabledef.getColumns()]).then((data) => {
      this.headOptions = data[0]
      this.columnOptions = data[1]
    })
  },
  computed: {
    prevIcon () {
      return faArrowLeft
    },
    nextIcon () {
      return faArrowRight
    },
    addIcon () {
      return faPlus
    },
    nextBtn () {
      return this.active >= 2 ? { text: '完成', type: 'success' } : { text: '下一步', type: 'primary' }
    },
    checkNewHead () {
      return this.newhead.length === 0 || this.newheads.includes(this.newhead[this.newhead.length - 1]) || (this.newheadtype.length > 0 && this.newhead[0] !== this.newheadtype)
    },
    checkNewColumn () {
      let flag = false
      this.columntypes.map(cel => {
        if (cel.ctype === this.newcolumn[0] && cel.name === this.newcolumn[this.newcolumn.length - 1]) flag = true
      })
      return this.newcolumn.length === 0 || flag
    }
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount']),
    next () {
      if (this.active === 0) {
        if (this.repfrmname && this.repfrmname.length > 0 && this.newheads.length > 0) {
          this.active++
        } else {
          this.$message({
            message: '请填写表名并定义行元素',
            type: 'warning',
            duration: 5000
          })
        }
      } else if (this.active === 1) {
        if (this.newcolumns.length > 0) {
          this._genReportTemplate()
          this.active++
        } else {
          this.$message({
            message: '请定义列元素',
            type: 'warning',
            duration: 5000
          })
        }
      } else if (this.active === 2) {
        this.loading = true
        repfrm.newTable(this.owner, this.tableset, {
          name: this.repfrmname, rows: this.newheads, columns: this.newcolumns
        }).then((resp) => {
          this.loading = false
          if (resp.data.result) {
            this.$message({
              type: 'success',
              message: '新建表成功'
            })
            this.$router.push('/main/repadmin')
          } else {
            this.$message({
              type: 'error',
              message: resp.data.data,
              duration: 8000
            })
          }
        }).catch((err) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: err.message,
            duration: 8000
          })
        })
      } else {
        this.active++
      }
    },
    prev () {
      if (--this.active < 0) this.active = 0
    },
    back () {
      this.$router.push('/main/repadmin')
    },
    newHeadChanged (value) {
    },
    addNewHead () {
      this.newheadtype = this.newhead[0]
      let items = this.newhead[this.newhead.length - 1].split('@')
      items.map(el => {
        if (!this.newheads.includes(el)) {
          this.newheads.push(el)
        }
      })
      this.newhead = []
    },
    deleteNewHead (idx) {
      this.newheads.splice(idx, 1)
      if (this.newheads.length === 0) this.newheadtype = ''
    },
    addNewColumn () {
      this.columntypes.push({ ctype: this.newcolumn[0], name: this.newcolumn[this.newcolumn.length - 1] })
      this.newcolumn = []
      this.newcolumns = []
      this.monthTags.map(mel => {
        this.columntypes.map(cel => {
          this.newcolumns.push({
            label: `${moment(mel, 'YYYYMM').format('YYYY年MM月')}${cel.name}`,
            month: mel,
            name: cel.name,
            ctype: cel.ctype
          })
        })
      })
    },
    deleteNewColumn (idx) {
      let delidx = -1
      for (let ridx = 0; ridx < this.columntypes.length; ridx++) {
        if (this.newcolumns[idx].name === this.columntypes[ridx].name &&
            this.newcolumns[idx].ctype === this.columntypes[ridx].ctype) {
          delidx = ridx
          break
        }
      }
      this.columntypes.splice(delidx, 1)
      this.newcolumns = []
      this.monthTags.map(mel => {
        this.columntypes.map(cel => {
          this.newcolumns.push({
            label: `${moment(mel, 'YYYYMM').format('YYYY年MM月')}${cel.name}`,
            month: mel,
            name: cel.name,
            ctype: cel.ctype
          })
        })
      })
    },
    _genReportTemplate () {
      this.templateTable = []
      for (let i = 0; i < this.newheads.length; i++) {
        let record = { head: this.newheads[i] }
        for (let j = 0; j < this.newcolumns.length; j++) {
          record[`col${j + 1}`] = ''
        }
        this.templateTable.push(record)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

#repfrmnew {
  width: 100%;
  height: 100%;
  padding: 0;
  .el-steps {
    margin: {
      left: 50px;
      right: 50px;
    }
    .el-step {
      margin-top: 50px;
    }
  }
  .el-button {
    float: right;
    margin: {
      top: 14px;
      right: 10px;
    }
  }
  .control-btns {
    margin-right: 50px;
  }
  .step-panel {
    margin: 50px;
    h5 {
      font-weight: 400;
      margin-bottom: 10px;
    }
    hr {
      height: 1px;
      border: none;
      border-top: solid 1px lightgrey;
    }
    .el-cascader {
      width: 100%;
    }
    .el-button {
      margin-left: 0;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    .el-tag {
      margin-top: 10px;
      margin-right: 12px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}

</style>
