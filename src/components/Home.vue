<template>
  <div class="body">
    <div class="container home">
      <div v-for="sale in sales">
        <div class="col-md-3 sale mx-auto mt-5">
          <img v-bind:src="sale.frontPicture">
          <div class="saleValues row">
            <div class="col-md-10">
              <p>{{sale.brand}} - {{sale.articleName}} - {{sale.price}}€</p>
            </div>
            <div class="seller col-md-2">
              <label>{{sale.seller}}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapActions,
    mapMutations,
    mapState,
    mapGetters
  } from 'vuex'
  export default {
    name: 'home',
    data() {
      return {}
    },
    computed: {
      ...mapState('sale', {
        sales: state => state.sales
      })
    },
    methods: {
      ...mapActions('sale', {
        fetchSales: 'fetchSales'
      })
    },
    created() {
      this.fetchSales();
    }
  }

</script>

<style scoped>
  .body {
    margin: 0;
    padding: 0;
  }

  .home {
    margin-top: 30px;
  }

  .sellValues {
    padding-top: 0px;
  }

</style>
