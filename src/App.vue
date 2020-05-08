<template>
  <div id="app">
    <b-overlay :show="loading" :fixed="true" :no-wrap="true" style="height: 100vh">
    </b-overlay>
    <router-view />
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Admin",
      data() {
      return {
        loading: true,
      }
    },
  created() {
    this.$store.watch(
      (state, getters) => {
      this.loading = getters.getIsLoading
      }
    )
  },
    
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
}
</style>
