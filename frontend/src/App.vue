<template>
  <Layout>
    <router-view v-slot="{ Component }">
      <component :is="Component"/>
    </router-view>
  </Layout>
</template>

<script>
import Layout from './components/Layout/Layout.vue'

export default {
  name: 'App',
  components: {
    Layout
  },
  created(){
    this.$store.commit('initialiseStore');
    this.$api.ajax.token = this.$store.state.user.token;
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  border: 0;
  font-family: Arial, serif;
  box-sizing: border-box;
}

// reset A tag
a {
  text-decoration: none;
  color: #fff;
}

body {
  margin-top: 60px; // to prevent the navbar from covering the content
  background-color: #34343f;
}

.container {
  display: block;
  margin: 0 auto;
  width: 1000px;
  max-width: calc(100% - 20px);
  min-height: calc(100vh - 60px);
}

.page[data-page] {
  margin-top: 80px;
  margin-bottom: 20px;
}
</style>