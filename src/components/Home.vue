<template>
  <div class="body">
    <div class="container-fluid" id="wrapMdScreen" v-if="fullWidth > 1024">
      <div class="row mx-auto" v-for="i in Math.ceil(sales.length / 3)">
        <div class="mr-4 sale container my-3 sale" v-for="sale in sales.slice((i - 1) * 3, i * 3)">
          <div class="container image-container">
            <img class="frontPicture mt-1" :src="sale.frontPicture">
          </div>
          <div class="row">
            <div class="col-md-7">{{sale.brand}} - {{sale.articleName}}</div>
            <div class="col-md-3 price">{{sale.price}}€</div>
            <div class="col-md-2">
              <router-link v-bind:to="{name:'viewSale',params:{displayName:user.displayName,id:sale.saleID}}">
                <i class="small material-icons prefix arrow mb-1">forward</i>
              </router-link>
            </div>
          </div>
          <!-- <p class="seller">{{sale.seller}}</p> -->
        </div>
      </div>
      <div class="container-fluid" id="wrapSmallScreen" v-if="fullWidth < 1024">
        <div class="row mx-auto">
          <div class="mx-2 sale container my-3 sale" v-for="sale in sales.slice((i - 1) * 2, i * 2)">
            <div class="image-container">
              <img class="frontPicture mt-1" :src="sale.frontPicture">
            </div>
            <div class="row">
              <div class="col-md-7">{{sale.brand}} - {{sale.articleName}}
              </div>
              <div class="col-md-3 price ml-5 pl-2">{{sale.price}}€</div>
              <div class="col-md-2">
                <router-link v-bind:to="{name:'viewSale',params:{displayName:user,id:sale.saleID}}">
                  <i class="small material-icons prefix arrow">forward</i>
                </router-link>
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
      return {
        fullHeight: document.documentElement.clientHeight,
        fullWidth: document.documentElement.clientWidth
      }
    },
    computed: {
      ...mapState('sale', {
        sales: state => state.sales,
      }),
      ...mapState('user', {
        user: state => state.currentUser
      })

    },
    methods: {
      ...mapActions({
        fetchSales: 'sale/fetchSales'
      }),
      ...mapMutations('sale', [
        'setStateToNull'
      ])
    },
    beforeRouteEnter(to, from, next) {
      if (to.meta.home) {
        next(vm => {
          vm.fetchSales()
          vm.setStateToNull()
        })
      } else {
        next()
      }
    }
  }

</script>

<style scoped>
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

  .container-fluid {
    display: flex;
    flex-direction: row;
  }

  @media screen and (min-width:1025px) and (max-width: 1920px) {
    #wrapMdScreen {
      width: 1200px;
      border: 1px solid black;
    }
    .sale {
      text-align: left;
      width: 320px;
      height: 220px;
      border: 1px solid black;
      font-weight: 600;
      background-color: rgb(252, 192, 101);
    }
    .sale:hover {
      background-color: rgb(255, 215, 177);
    }
    router-link .arrow {
      max-width:80%;
      max-height:80%;
    }
    .image-container {
      text-align: center;
      vertical-align: middle;
      width: 320px;
      height: 195px;
    }
    .price {
      text-align: right;
      font-weight: 700;
    }
    .sale .image-container img {
      max-width: 325px;
      max-height: 190px;
    }
  }

  @media screen and (min-width:640px) and (max-width:1024px) {
    #wrapSmallScreen {
      width: 760px;
      border: 1px solid black;
    }
    .sale {
      width: 220px;
      height: 138px;
      font-weight: 600;
      background-color: rgb(252, 192, 101);
    }
    .sale:hover {
      background-color: rgb(255, 215, 177);
    }
    .image-container {
      text-align: center;
      vertical-align: middle;
    }
    .price {
      font-weight: 700;
    }
    .sale .image-container img {
      max-width: 206px;
      max-height: 120px;
    }
  }

</style>
