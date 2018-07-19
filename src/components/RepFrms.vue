<template>
  <div id="repfrmpage">
    <el-container>
      <el-aside width="200px" v-loading="repfrmsLoading">
        <el-menu>
          <br>
          <el-menu-item-group v-for="group in repfrms" :key="group.id">
            <template slot="title">{{ group.groupname }}</template>
            <el-menu-item v-for="frm in group.frms" :key="frm.id" :index="frm.id">
              {{ frm.frmname }}
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-main></el-main>
    </el-container>
  </div>
</template>

<script>
import repfrm from '../api/reportforms'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      repfrms: [],
      repfrmsLoading: false
    }
  },
  mounted () {
    this.repfrmsLoading = true
    repfrm.getFrms(this.getLoginAccount()).then((data) => {
      this.repfrms = data
      this.repfrmsLoading = false
    })
  },
  methods: {
    ...mapGetters('account', ['getLoginAccount'])
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>

#repfrmpage {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  text-align: left;
  .el-container {
    width: 100%;
    height: 100%;
    .el-aside {
      height: 100%;
      .el-menu {
        height: 100%;
      }
    }
  }
}

</style>
