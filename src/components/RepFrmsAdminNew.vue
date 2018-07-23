<template>
  <div>
    <br>
    <br>
    <br>
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <el-button style="margin-top: 12px; float: right; margin-right: 50px;" @click="back">返回</el-button>
    <el-button style="margin-top: 12px; float: right; margin-right: 10px;" @click="next">下一步</el-button>
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

.el-steps {
  margin-left: 50px;
  margin-right: 50px;
}

</style>
