<template>
  <div class="container">
    <div class="row">
      <div class="col s12 m8 offset-m2">
        <div class="register card-panel white-text center">
          <h3>Register</h3>
          <form>
              <div class="input-field">
                  <i class="material-icons prefix">account_box</i>
                  <input type="text" id="displayName" v-model="displayName" v-on:change="setDisplayName(displayName)">
                  <label class="white-text" for="email">User Name</label>
                </div>
            <div class="input-field">
              <i class="material-icons prefix">email</i>
              <input type="text" id="email" v-model="email" v-on:change="setEmail(email)">
              <label class="white-text" for="email">Email</label>
            </div>
            <div class="input-field">
              <i class="material-icons prefix">lock</i>
              <input type="password" id="password" v-model="password" v-on:change="setPassword(password)">
              <label class="white-text" for="password">Password</label>
            </div>
            <button type="button" class="btn btn-large green lighten-4 black-text" v-on:click="register">Register</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import {
    mapActions,
    mapMutations
  } from 'vuex'
  export default {
    name: 'register',
    data() {
      return {
        email: '',
        password: '',
        displayName: ''
      }
    },
    methods: {
      ...mapActions('user', {
        register: 'register'
      }),
      ...mapMutations('user', [
        'setPassword',
        'setEmail',
        'setDisplayName'
      ])
    }
  }

</script>

<style scoped>
  .card-panel {
    background-color: rgb(2, 191, 233);
  }

</style>
