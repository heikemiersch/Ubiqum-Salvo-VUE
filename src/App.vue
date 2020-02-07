<template>
  <div id="app">
    <h1>schmalz</h1>
    <div id="nav">
      <!--   <router-link to="/">login</router-link>|
      <router-link to="/gameslist">List of Games</router-link>|
      <router-link to="/gameview">Gameview</router-link>|
      <router-link to="/leaderboard">Leaderboard</router-link>-->
    </div>
    <router-view @gamePlayerId="listenGamePlayerId" />
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
      console.log(event.gpid);

      console.log(this.gamePlayerId);
    }
  }
};

//import styles from "./style.css";
</script>

<style>
</style>
