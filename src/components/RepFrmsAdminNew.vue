<template>
  <div id="repfrmnew">
    <el-steps :active="active" finish-status="success">
      <el-step title="1,定义报表表头"></el-step>
      <el-step title="2,定义报表列"></el-step>
      <el-step title="3,汇总确认"></el-step>
    </el-steps>
    <div class="control-btns">
      <el-button size="small" @click="back">返回管理页面</el-button>
      <el-button type="primary" size="small" @click="next" plain>下一步</el-button>
    </div>
    <div class="step-panel" v-show="active === 0">
      <br>
      <h3>输入表名</h3>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入表名"></el-input>
        </el-col>
      </el-row>
      <h3>定义表头</h3>
    </div>
    <div class="step-panel" v-show="active === 1">
      <br>
      <h3>第二步</h3>
    </div>
    <div class="step-panel" v-show="active === 2">
      <br>
      <h3>汇总信息</h3>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  },
  methods: {
    next () {
      if (this.active++ > 2) this.active = 0
    },
    back () {
      this.$router.push('/main/repadmin')
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
  }
}

</style>
