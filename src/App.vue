<template>
  <FlowdockSearch msg="Search Flowdock"/>
</template>

<script>
import FlowdockSearch from './components/FlowdockSearch.vue'

export default {
  name: 'App',
  components: {
    FlowdockSearch
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
