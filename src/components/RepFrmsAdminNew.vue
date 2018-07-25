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
      <h3>输入表名</h3>
      <el-row>
        <el-col :span="9">
          <el-input placeholder="请输入表名"></el-input>
        </el-col>
      </el-row>
      <br>
      <h3>定义表头</h3>
      <el-row>
        <el-col :span="8">
          <el-cascader :options="headOptions" v-model="newhead" @change="newHeadChanged" clearable></el-cascader>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" :disabled="newhead.length === 0" @click="addNewHead()" plain><font-awesome-icon :icon="addIcon"/></el-button>
        </el-col>
      </el-row>
      <h5>已定义表头</h5><hr>
      <el-row>
        <el-col :span="24" v-show="newheads.length === 0">(空)</el-col>
        <el-col :span="24" v-show="newheads.length > 0">
          <el-tag v-for="(nh, idx) in newheads" :key="idx" :type="tagColors[idx % 4]" @close="deleteNewHead(idx)" closable>{{ nh }}</el-tag>
        </el-col>
      </el-row>
    </div>
    <div class="step-panel" v-show="active === 1">
      <br>
      <h3>定义列</h3>
      <el-row>
        <el-col :span="8">
          <el-cascader :options="columnOptions" clearable></el-cascader>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" :disabled="newcolumn.length === 0" plain><font-awesome-icon :icon="addIcon"/></el-button>
        </el-col>
      </el-row>
      <h5>已定义列</h5><hr>
      <el-row>
        <el-col :span="24" v-show="newcolumns.length === 0">(空)</el-col>
        <el-col :span="24" v-show="newcolumns.length > 0">
          <el-tag v-for="(nc, idx) in newcolumns" :key="idx" :type="tagColors[idx % 4]" closable>{{ nc }}</el-tag>
        </el-col>
      </el-row>
    </div>
    <div class="step-panel" v-show="active === 2">
      <br>
      <h3>汇总信息</h3>
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
          value: '流量',
          label: '流量',
          children: [
            {
              value: '同比增幅',
              label: '同比增幅',
              children: [
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
      ],
      newcolumns: []
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
    }
  },
  methods: {
    next () {
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
