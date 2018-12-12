<template>
  <div id="upload" v-loading="uploadLoading">
    <h3 class="title">系统数据</h3>
    <div class="tree-area">
      <el-tree :data="treedata" :props="defaultProps" accordion></el-tree>
    </div>
    <el-upload
      class="uploadarea"
      ref="uploadexcel"
      action="http://localhost:9000/upload"
      name="excels"
      accept=".xls,.xlsx,.xlsm"
      multiple
      :limit="10"
      :on-success="saveToDB"
      :on-exceed="whenExceed"
      :auto-upload="false"
      style="width:100;">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left:10px;margin-right:10px;" size="small" type="success" :disabled="uploadmonth.length===0" @click="uploadaction()">上传</el-button>
        <span style="margin-right:5px;font-size:15px;color:grey;">账期</span>
        <el-select v-model="uploadmonth" placeholder="请选择">
          <el-option
            v-for="item in monthoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </el-upload>
  </div>
</template>

<script>
import moment from 'moment'
import excel from '../api/excel'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      uploadLoading: false,
      owner: '',
      uploadmonth: '',
      uploadflag: true,
      uploadcount: 0,
      monthoptions: [],
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
          type: 'error',
          duration: 6000
        })
      })
      this.uploadLoading = false
    } else {
      this.$message({
        message: '登录信息过期，请重新登录',
        type: 'error'
      })
      this.$router.push('/')
      this.uploadLoading = false
    }
    let curmonth = moment()
    for (let i = 0; i < 12; i++) {
      this.monthoptions.push({ label: curmonth.format('YYYY年MM月'), value: curmonth.format('YYYYMM') })
      curmonth = curmonth.subtract(1, 'month')
    }
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount']),
    ...mapActions('account', ['recordAccount']),
    uploadaction () {
      this.uploadLoading = true
      this.uploadcount = 0
      this.$refs.uploadexcel.submit()
    },
    saveToDB (response, file, fileList) {
      if (response.result) {
        this.uploadcount += 1
        excel.uploadSingleFile(this.uploadmonth, response.file.path).then(doc => {
          if (this.uploadcount === fileList.length) {
            setTimeout(() => {
              excel.queryAll().then(docs => {
                this.treedata = docs
                this.uploadmonth = ''
                this.uploadLoading = false
                this.$refs.uploadexcel.clearFiles()
                this.$message({
                  message: '上传成功',
                  type: 'success',
                  duration: 1200
                })
              }).catch(err => {
                this.uploadmonth = ''
                this.uploadLoading = false
                this.$refs.uploadexcel.clearFiles()
                this.$message({
                  type: 'error',
                  message: err.message,
                  duration: 8000
                })
              })
            }, 1200)
          }
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'error',
            duration: 8000
          })
        })
      }
    },
    whenExceed (files, fileList) {
      this.$message({
        type: 'warning',
        message: `最大上传文件数量为10,您本次上传了${files.length}个,请重新选择`,
        duration: 6000
      })
    }
  }
}
</script>

<style lang="scss" scoped>

#upload {
  width: 100%;
  height: 95%;
  margin: 0;
  padding: 0;
  text-align: left;
  .uploadarea {
    margin: 30px;
    .el-form-item {
      margin-right: 20px;
      .el-input {
        width: 200px;
      }
    }
  }
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
