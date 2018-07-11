<template>
  <nav>
    <div class="nav-wrapper grey">
      <div class="container">
        <router-link to="/" class="brand-logo center" id="brandName">Clothes Store</router-link>
        <ul>
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="#">Buy</router-link>
          </li>
          <li>
            <router-link to="/new_sale">Sell</router-link>
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
            <div class="col-md-6">
              <router-link tag="button" class="btn userLink" v-bind:to="{name:'userProfile',params:{displayName:user.displayName}}">
                <label class="user mr-2">{{user.displayName}}</label>
              </router-link>
            </div>
            <div class="col-md-6">
              <button class="btn black" id="logout" v-on:click="logout">Logout</button>
            </div>
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
        'setEmail',
      ]),
      ...mapActions('user', {
        logout: 'logout'
      }),
    },
    computed: {
      ...mapGetters('user', {
        isLoggedIn: 'loggedIn'
      }),
      ...mapState('user', {
        user: state => state.currentUser
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
  .user {
    border-bottom: 3px solid rgb(31, 120, 252);
    color: rgb(0, 0, 0);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 14px;
    font-weight: 600;
    margin-right: 25px;
    line-height: 1.2;
  }

  .userLink {
    max-width: 100px;
    display: inline-block;
    box-sizing: border-box; /* <- added this */
  }

  #logout:hover {
    border: 1px white solid;
  }

</style>
