<template>
  <div id="repfrmnew">
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
          <el-tag v-for="(nh, idx) in newheads" :key="nh" :type="tagColors[idx % 4]" closable @close="deleteNewHead(idx)">{{ nh }}</el-tag>
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
          <el-tag v-for="(nc, idx) in newcolumns" :key="nc" :type="tagColors[idx % 4]" closable @close="deleteNewColumn(idx)">{{ nc }}</el-tag>
        </el-col>
      </el-row>
    </div>
    <div class="step-panel" v-show="active === 2">
      <br>
      <h3>{{ repfrmname }}</h3>
      <el-table :data="templateTable" border>
        <el-table-column prop="head" label="地市"></el-table-column>
        <el-table-column v-for="(c, idx) in newcolumns" :key="c" :prop="`col${idx}`" :label="c"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { faArrowLeft, faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons'

export default {
  data () {
    return {
      active: 0,
      tagColors: ['', 'success', 'info', 'warning'],
      repfrmname: '',
      newhead: [],
      headOptions: [
        {
          value: '地市',
          label: '地市',
          children: [
            { value: '西安@铜川@咸阳@宝鸡@渭南@汉中@安康@商洛@榆林@延安', label: '全部' },
            { value: '西安', label: '西安' },
            { value: '铜川', label: '铜川' },
            { value: '咸阳', label: '咸阳' },
            { value: '宝鸡', label: '宝鸡' },
            { value: '渭南', label: '渭南' },
            { value: '汉中', label: '汉中' },
            { value: '安康', label: '安康' },
            { value: '商洛', label: '商洛' },
            { value: '榆林', label: '榆林' },
            { value: '延安', label: '延安' }
          ]
        }
      ],
      newheads: [],
      newcolumn: [],
      columnOptions: [
        {
          value: '业务',
          label: '业务',
          children: [
            {
              value: '流量',
              label: '流量',
              children: [
                {
                  value: '同比增幅',
                  label: '同比增幅',
                  children: [
                    { value: '2018年1月@2018年2月@2018年3月@2018年4月@2018年5月@2018年6月@2018年7月', label: '2018年' },
                    { value: '2018年1月', label: '2018年1月' },
                    { value: '2018年2月', label: '2018年2月' },
                    { value: '2018年3月', label: '2018年3月' },
                    { value: '2018年4月', label: '2018年4月' },
                    { value: '2018年5月', label: '2018年5月' },
                    { value: '2018年6月', label: '2018年6月' },
                    { value: '2018年7月', label: '2018年7月' }
                  ]
                }
              ]
            }
          ]
        },
        {
          value: '收入',
          label: '收入',
          children: [
            {
              value: '流量收入',
              label: '流量收入',
              children: [
                { value: '当月完成', label: '当月完成' },
                { value: '当月同比', label: '当月同比' },
                { value: '本年累计', label: '本年累计' },
                { value: '累计同比', label: '累计同比' }
              ]
            }
          ]
        }
      ],
      newcolumns: [],
      templateTable: []
    }
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
      return this.newhead.length === 0 || this.newheads.includes(this.newhead[this.newhead.length - 1])
    },
    checkNewColumn () {
      return this.newcolumn.length === 0 || this.newcolumns.includes(this.newcolumn.slice(this.newcolumn.length - 1).concat(this.newcolumn.slice(0, this.newcolumn.length - 1)).join(''))
    }
  },
  methods: {
    next () {
      if (this.active === 1) {
        this._genReportTemplate()
        console.log(this.templateTable)
      }
      if (this.active++ > 2) this.active = 0
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
      let items = this.newhead[this.newhead.length - 1].split('@')
      this.newheads.push(...items)
      this.newhead = []
    },
    deleteNewHead (idx) {
      this.newheads.splice(idx, 1)
    },
    addNewColumn () {
      let lastitems = this.newcolumn[this.newcolumn.length - 1].split('@')
      let items = lastitems.map(li => {
        let tmp = this.newcolumn.slice(0, this.newcolumn.length - 1)
        tmp.unshift(li)
        return tmp.join('')
      })
      this.newcolumns.push(...items)
      this.newcolumn = []
    },
    deleteNewColumn (idx) {
      this.newcolumns.splice(idx, 1)
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
    }
  }
}

</style>
