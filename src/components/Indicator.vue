<template>
  <div id="indicator" v-loading="indicatorLoading">
    <el-row>
      <el-button-group style="margin-top: 24px;">
        <el-button type="primary" @click="dialogNewPixel = true">新建<b style="color:darkred;">原子</b>指标</el-button>
        <el-button type="primary" @click="dialogNewIndicator = true">新建<b style="color:darkred;">派生</b>指标</el-button>
      </el-button-group>
    </el-row>
    <el-dialog
      title="新建原子指标"
      :visible.sync="dialogNewPixel"
      width="40%"
      :close-on-click-modal="false"
      @closed="dialogNewPixelClose()">
      <div class="dialog-body">
        <el-form :model="frmPixel">
          <el-form-item label="名称" label-width="70px">
            <el-input v-model="frmPixel.name" placeholder="有意义的中文名"></el-input>
          </el-form-item>
          <el-form-item label="类型" label-width="70px">
            <el-input v-model="frmPixel.type" placeholder="可以是已经存在的类型，也可以重新定义"></el-input>
          </el-form-item>
          <el-form-item label="Excel" label-width="70px">
            <el-input v-model="frmPixel.excel" placeholder="仅需要提供部分excel文件名，不需要带日期信息"></el-input>
          </el-form-item>
          <el-form-item label="Sheet" label-width="70px">
            <el-input v-model="frmPixel.sheet" placeholder="必须提供完整Sheet名称"></el-input>
          </el-form-item>
          <el-form-item label="关键字" label-width="70px">
            <el-input v-model="frmPixel.keywords" placeholder="关键字列表，以空格隔开，以@符号代替关键字中空格"></el-input>
          </el-form-item>
          <el-form-item label="RowIndex" label-width="70px">
            <el-input-number v-model="frmPixel.rowindex" :min="0" :max="99" label="描述"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" :disabled="!checkNewPixel()" @click="newPixel()">确定</el-button>
        <el-button @click="dialogNewPixel = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新建派生指标"
      :visible.sync="dialogNewIndicator"
      width="40%"
      :close-on-click-modal="false"
      @closed="dialogNewIndicatorClose()">
      <div class="dialog-body">
        <el-form :model="frmIndicator">
          <el-form-item label="名称" label-width="60px">
            <el-input v-model="frmIndicator.name" placeholder="有意义的中文名称"></el-input>
          </el-form-item>
          <el-form-item label="类型" label-width="60px">
            <el-input v-model="frmIndicator.type" placeholder="可以是已经存在的类，也可以重新定义"></el-input>
          </el-form-item>
          <el-form-item label="规则" label-width="60px">
            <el-input v-model="frmIndicator.rule" placeholder="由原子指标通过四则运算组成"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" :disabled="!checkNewIndicator()" @click="newIndicator()">确定</el-button>
        <el-button @click="dialogNewIndicator = false">取消</el-button>
      </span>
    </el-dialog>
    <el-tabs v-model="selectedTabName" v-show="indicators.length > 0">
      <el-tab-pane v-for="idctype in indicators" :key="idctype.name" :label="idctype.name">
        <template v-for="(idc, idx) in idctype.indicators">
          <el-tooltip :key="idc.name" effect="light" :open-delay="tooltipdelay" placement="top">
            <div slot="content">
              <template v-if="idc.pixel">
                定义：{{ idc.pixel }}
              </template>
              <template v-else>
                规则：{{ idc.rule }}
              </template>
            </div>
            <el-tag :type="tagColors[idx % 4]" closable @close="deleteIndicator(idc, idctype.name)">{{ idc.name }}</el-tag>
          </el-tooltip>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import indicator from '../api/indicator'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      indicatorLoading: false,
      owner: '',
      tooltipdelay: 500,
      indicators: [],
      tagColors: ['', 'success', 'info', 'warning'],
      selectedTabName: '',
      dialogNewPixel: false,
      dialogNewIndicator: false,
      frmPixel: {
        name: '',
        type: '',
        excel: '',
        sheet: '',
        keywords: '',
        rowindex: '0'
      },
      frmIndicator: {
        name: '',
        type: '',
        rule: ''
      }
    }
  },
  mounted () {
    this.indicatorLoading = true
    this.owner = this.getLoginAccount()
    let userCookie = this.$cookie.get('user')
    if (!!this.owner === false && !!userCookie === true) {
      this.owner = userCookie
      this.recordAccount(userCookie)
    }
    if (this.owner.length > 0) {
      indicator.formatAllIndicators().then(docs => {
        this.indicators = docs
        this.indicatorLoading = false
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
        this.indicatorLoading = false
      })
    } else {
      this.$message({
        message: '登录信息过期，请重新登录',
        type: 'error'
      })
      this.$router.push('/')
      this.indicatorLoading = false
    }
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount']),
    ...mapActions('account', ['recordAccount']),
    refresh () {
      this.indicatorLoading = true
      if (this.owner.length > 0) {
        indicator.formatAllIndicators().then(docs => {
          this.indicators = docs
          this.indicatorLoading = false
          this.selectedTabName = '0'
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
          this.indicatorLoading = false
        })
      } else {
        this.$message({
          message: '登录信息过期，请重新登录',
          type: 'error'
        })
        this.$router.push('/')
        this.indicatorLoading = false
      }
    },
    newPixel () {
      this.dialogNewPixel = false
      this.indicatorLoading = true
      indicator.newPixel(this.frmPixel.name, this.frmPixel.excel, this.frmPixel.sheet, this.frmPixel.keywords, this.frmPixel.rowindex).then(resp => {
        indicator.newIndicator(this.frmPixel.type, this.frmPixel.name, this.frmPixel.name).then(resp => {
          this.$message({
            type: 'success',
            message: '新建原子指标成功'
          })
          this.refresh()
          this.indicatorLoading = false
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
          this.indicatorLoading = false
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
        this.indicatorLoading = false
      })
    },
    checkNewPixel () {
      return this.frmPixel.name && this.frmPixel.name.length &&
            this.frmPixel.type && this.frmPixel.type.length &&
            this.frmPixel.excel && this.frmPixel.excel.length &&
            this.frmPixel.sheet && this.frmPixel.sheet.length &&
            this.frmPixel.keywords && this.frmPixel.keywords.length
    },
    dialogNewPixelClose () {
      this.frmPixel = {
        name: '',
        type: '',
        excel: '',
        sheet: '',
        keywords: '',
        rowindex: '0'
      }
    },
    newIndicator () {
      this.dialogNewIndicator = false
      this.indicatorLoading = true
      indicator.newIndicator(this.frmIndicator.type, this.frmIndicator.name, this.frmIndicator.rule).then(resp => {
        this.$message({
          type: 'success',
          message: '新建派生指标成功'
        })
        this.refresh()
        this.indicatorLoading = false
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
        this.indicatorLoading = false
      })
    },
    checkNewIndicator () {
      return this.frmIndicator.name && this.frmIndicator.name.length &&
            this.frmIndicator.type && this.frmIndicator.type.length &&
            this.frmIndicator.rule && this.frmIndicator.rule.length
    },
    dialogNewIndicatorClose () {
      this.frmIndicator = {
        name: '',
        type: '',
        rule: ''
      }
    },
    deleteIndicator (indicatorObj, type) {
      this.$confirm(`删除指标 "${indicatorObj.name}"？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(type)
        // console.log(indicatorObj)
        if (indicatorObj.pixel) {
          indicator.deleteIndicator(type, indicatorObj.name).then(resp => {
            indicator.deletePixel(indicatorObj.name).then(resp => {
              this.$message({
                type: 'success',
                message: '删除指标成功'
              })
              this.refresh()
            }).catch(err => {
              this.$message({
                type: 'error',
                message: err.message
              })
            })
          }).catch(err => {
            this.$message({
              type: 'error',
              message: err.message
            })
          })
        } else {
          indicator.deleteIndicator(type, indicatorObj.name).then(resp => {
            this.$message({
              type: 'success',
              message: '删除指标成功'
            })
            this.refresh()
          }).catch(err => {
            this.$message({
              type: 'error',
              message: err.message
            })
          })
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>

#indicator {
  width: 100%;
  height: 99%;
  margin: 0;
  padding: 0;
  .el-tabs {
    margin: 5px;
    margin-bottom: 48px;
    text-align: left;
    .el-tag {
      margin-top: 8px;
      margin-left: 12px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .dialog-body {
    text-align: left;
    margin: 6px;
    .el-form-item {
      margin: 8px;
    }
  }
}

</style>
