<template>
  <div id="repfrminfopage" v-loading="loading">
    <el-row class="info-header">
      <el-col :span="24">
        <el-button type="primary" plain>新建报表集合&nbsp;<font-awesome-icon :icon="newgroupIcon"/></el-button>
      </el-col>
    </el-row>
    <div v-for="gp in groups" :key="gp.id" class="group-item">
      <h3>
        {{ gp.groupname }}
        <el-button type="primary" size="small" @click="newRepFrm()" plain circle>
          <font-awesome-icon :icon="newgroupIcon"/>
        </el-button>
      </h3>
      <hr/>
      <el-row>
        <el-col :span="6" v-for="frm in gp.frms" :key="frm.id">
          <el-card class="frm-card-item">
            <div slot="header">
              <span>{{ frm.frmname }}</span>
              <el-dropdown szie="small" trigger="click" :hide-on-click="false" :ref="`dropdown-${gp.id}-${frm.id}`" class="frm-card-option">
                <span class="el-dropdown-link">
                  设置可见<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><el-checkbox>员工A</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工B</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工C</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox>员工D</el-checkbox></el-dropdown-item>
                  <el-button type="text" @click="saveHide(gp.id, frm.id)">确定</el-button><el-button type="text" @click="cancelHide(gp.id, frm.id)">取消</el-button>
                </el-dropdown-menu>
              </el-dropdown>
              <!--<el-button class="frm-card-option" type="text">操作按钮</el-button>-->
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import repfrms from '../api/reportforms'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      groups: [],
      loading: false
    }
  },
  mounted () {
    this.loading = true
    repfrms.getFrms(this.getLoginAccount()).then((data) => {
      this.groups = data
      this.loading = false
    })
  },
  computed: {
    newgroupIcon () {
      return faPlus
    }
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount']),
    newRepFrm () {
      this.$router.push('/main/repadmin/new')
    },
    saveHide (gpid, frmid) {
      this.cancelHide(gpid, frmid)
    },
    cancelHide (gpid, frmid) {
      let dropdownObj = this.$refs[`dropdown-${gpid}-${frmid}`]
      if (dropdownObj.length && dropdownObj[0].hide) {
        dropdownObj[0].hide()
      }
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
      width: 85%;
      margin-left: 30px;
      margin-right: 10px;
      margin-top: 30px;
      &:hover {
        transform:scale(1.02)
      }
      .frm-card-option {
        float: right;
        padding: 3px 0;
        .el-dropdown-link {
          cursor: pointer;
          color: #409EFF;
        }
      }
    }
  }
}

</style>
