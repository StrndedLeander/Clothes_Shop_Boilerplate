<template>
  <div class="container">
    <div class="row">
      <div class="col s12 m8 offset-m2">
        <div class="login card-panel blue white-text center">
          <h3>Login</h3>
          <form>
            <div class="input-field">
              <i class="material-icons prefix">email</i>
              <input type="text" id="email" v-model="email" v-on:change="setEmail(email)">
              <label class="white-text " for="email ">Email</label>
            </div>
            <div class="input-field ">
              <i class="material-icons prefix ">lock</i>
              <input type="password" id="password" v-model="password" v-on:change="setPassword(password)">
              <label class="white-text " for="password ">Password</label>
            </div>
            <button type="button" class="btn btn-large green lighten-4 black-text " v-on:click="login ">Login</button>
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
    name: 'login',
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      ...mapActions('user', {
        login: 'login'
      }),
      ...mapMutations('user', [
        'setPassword',
        'setEmail'
      ])
    }
  }

</script>

<style scoped>


</style>
