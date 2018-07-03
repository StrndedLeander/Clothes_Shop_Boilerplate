<template>
  <div class="body">
    <div class="container">
      <div class="row" v-for="i in Math.ceil(sales.length / 3)">
        <div v-for="sale in sales.slice((i - 1) * 3, i * 3)">
          <div class="col-md-4 sale mt-5">
            <img class="frontPicture" :src="sale.frontPicture">
            <div class="saleValues row">
              <div class="col-md-10">
                <p>{{sale.brand}} - {{sale.articleName}} - {{sale.price}}€</p>
                <p class="seller">{{sale.seller}}</p>
              </div>
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
      }),
      ...mapMutations('sale', [
        'setStateToNull'
      ])
    },
    created() {
      this.fetchSales();
      this.setStateToNull()
    }
  }

</script>

<style scoped>
  .body {
    background-color: rgb(255, 180, 153);
  }

  .seller {
    margin-top: -10px;
    font-weight: 600;
    font-size: 75%;
    color: rgb(0, 0, 0);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }

  .sellValues {
    padding-top: 0px;
  }

  .frontPicture {
    max-width: 256px;
    max-height: 144px;
  }

</style>
