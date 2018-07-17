<template>
  <div id="hellopage">
    <h1>{{ getTheWorld }}</h1>
    <el-button @click="changeTheWorldAsync('Hi, Zhi')">change</el-button>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'HelloWorld',
  computed: {
    ...mapGetters('message', ['getTheWorld'])
  },
  methods: {
    ...mapActions('message', ['changeTheWorldAsync']),
    ...mapMutations('message', ['changeTheWorld'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}

</style>
