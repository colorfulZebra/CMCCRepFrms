<template>
  <div id="indicator" v-loading="indicatorLoading">
    <el-tabs>
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
            <el-tag :type="tagColors[idx % 4]">{{ idc.name }}</el-tag>
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
      tagColors: ['', 'success', 'info', 'warning']
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
    ...mapActions('account', ['recordAccount'])
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
    text-align: left;
    .el-tag {
      margin-top: 8px;
      margin-left: 12px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}

</style>
