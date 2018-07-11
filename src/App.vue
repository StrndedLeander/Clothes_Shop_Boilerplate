<template>
  <div id="app">
    <Navbar/>
    <router-view/>
  </div>
</template>

<script>
  import Navbar from './components/Navbar'
  export default {
    name: 'App',
    components: {
      Navbar
    }
  }

</script>

<style>
  *{
    padding: 0;
    margin: 0;
  }
  #app {
    background-color: rgb(255, 177, 103);
  }

</style>
