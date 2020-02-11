<template>
  <div id="app">
    <div id="nav">
      <!--   <router-link to="/">login</router-link>|
      <router-link to="/gameslist">List of Games</router-link>|
      <router-link to="/gameview">Gameview</router-link>|
      <router-link to="/leaderboard">Leaderboard</router-link>-->
    </div>
    <router-view @gamePlayerId="listenGamePlayerId"></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},

  data: function() {
    return {
      gamePlayerId: null
    };
  },

  methods: {
    listenGamePlayerId: function(event) {
      this.gamePlayerId = event.gpid;
      // works ↓↓↓↓↓↓↓↓
      console.log(event.gpid);

      // works ↓↓↓↓↓↓↓↓
      console.log(this.gamePlayerId);
    }
  }
};

//import styles from "./style.css";
</script>

<style>
</style>
