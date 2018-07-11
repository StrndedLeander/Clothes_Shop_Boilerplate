<template>
  <div class="container mt-2" id="createSale">
    <form @submit.prevent="prepareSale" class="col s12">
      <div class="row">
        <div class="input-field col s12">
          <input type="text" v-model="articleName" v-on:change="setArticleName(articleName)" required>
          <label class="label">Article Name</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" v-model="description" v-on:change="setDescription(description)" required>
          <label class="label">Description</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" v-model="brand" v-on:change="setBrand(brand)" required>
          <label class="label">Brand</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input style="padding-top: 16px;" type="number" v-model="price" v-on:change="setPrice(price)" required>
          <label class="label">Price</label>
        </div>
      </div>
      <UploadFile />
      <button type="submit" class="btn btn-success">Submit</button>
      <router-link to="/" class="btn grey">Cancel</router-link>
    </form>
  </div>
</template>

<script>
  import UploadFile from '@/components/UploadFile'
  import {
    mapActions,
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    name: 'createSale',
    components: {
      UploadFile
    },
    data() {
      return {
        articleName: '',
        description: '',
        brand: '',
        price: ''
      }
    },
    methods: {
      ...mapMutations('sale', [
        'setArticleName',
        'setDescription',
        'setBrand',
        'setPrice'
      ]),
      ...mapActions('sale', {
        prepareSale: 'prepareSaleFiles',
        createSale: 'createSale',
        generateSaleID: 'generateSaleID'
      })
    },
    created() {
      this.generateSaleID()
    },
    computed: {
      ...mapState('sale', {
        sale: state => state.currentSale
      }),
    },
  }

</script>

<style scoped>
  @media screen and (min-width:1024px) and (max-width:1400px) {
    #createSale {
      width: 800px;
    }
    .label {
      color: black;
    }
  }

  @media screen and (min-width:1400px) {
    #createSale {
      width: 100%;
    }
  }

</style>
