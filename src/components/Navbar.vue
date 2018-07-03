<template>
  <nav>
    <div class="nav-wrapper blue">
      <div class="container">
        <router-link to="/" class="brand-logo center" id="brandName">Clothes Store</router-link>
        <ul>
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/new_sale">Add Item</router-link>
          </li>
        </ul>
        <ul class="right">
          <li v-if="!isLoggedIn">
            <router-link to="/login">Login</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/register">Register</router-link>
          </li>
          <li v-if="isLoggedIn">
            <label id="user">{{user}}</label>
            <button class="btn black" id="logout" v-on:click="logout">Logout</button>
          </li>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  import {
    mapActions,
    mapMutations,
    mapState,
    mapGetters
  } from 'vuex'
  export default {
    name: 'navbar',
    data() {
      return {}
    },
    methods: {
      ...mapMutations('user', [
        'setCurrentUser',
        'setNoUser',
        'setEmail'
      ]),
      ...mapActions('user', {
        logout: 'logout'
      })
    },
    computed: {
      ...mapGetters('user', {
        isLoggedIn: 'loggedIn'
      }),
      ...mapState('user', {
        user: state => state.currentUser.email
      })
    },
    created() {
      if (this.isLoggedIn) {
        this.setCurrentUser()
      }
    }
  }

</script>

<style scoped>
  #brandName:hover {
    font-weight: 600;
    color: rgb(91, 255, 118);
  }

  #user {
    border-bottom: 3px solid rgb(31, 120, 252);
    color: rgb(23, 22, 53);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 16px;
    font-weight: 600;
    margin-right: 25px;
    line-height: 1.2;
  }

  #logout:hover {
    border: 1px white solid;
  }

</style>
