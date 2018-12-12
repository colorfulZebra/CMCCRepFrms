<template>
  <div id="indicator" v-loading="indicatorLoading">
  </div>
</template>

<script>
export default {
  data () {
    return {
      indicatorLoading: true
    }
  }
}
</script>

<style lang="scss" scoped>

#indicator {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

</style>
