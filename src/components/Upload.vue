<template>
  <div id="upload" v-loading="uploadLoading">
    <h3 class="title">系统数据</h3>
    <div class="tree-area">
      <el-tree :data="treedata" :props="defaultProps" accordion></el-tree>
    </div>
  </div>
</template>

<script>
import excel from '../api/excel'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      uploadLoading: false,
      owner: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treedata: []
    }
  },
  mounted () {
    this.uploadLoading = true
    this.owner = this.getLoginAccount()
    let userCookie = this.$cookie.get('user')
    if (!!this.owner === false && !!userCookie === true) {
      this.owner = userCookie
      this.recordAccount(userCookie)
    }
    if (this.owner.length) {
      excel.queryAll().then(docs => {
        this.treedata = docs
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
      this.uploadLoading = false
    } else {
      this.uploadLoading = false
      this.$message({
        message: '登录信息过期，请重新登录',
        type: 'error'
      })
      this.$router.push('/')
    }
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount']),
    ...mapActions('account', ['recordAccount'])
  }
}
</script>

<style lang="scss" scoped>

#upload {
  width: 100%;
  margin: 0;
  padding: 0;
  text-align: left;
  .title {
    padding-left: 10px;
    padding-right: 10px;
  }
  .tree-area {
    background-color: white;
    border: 1px solid lightgrey;
    margin: 0;
    padding: 0;
  }
}

</style>
