<template>
  <div>
    <div id="board">
      <div class="banner">
        <h2>+ Leaderboard + + + Leaderboard + + + Leaderboard + +</h2>
      </div>
      <div class="leaderboard">
        <table id="leaderboard">
          <thead>
            <th>Player</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Ties</th>
            <th>Score</th>
          </thead>
          <tbody>
            <tr v-for="player in leaderboard" :key="player.id">
              <td>{{ player.player }}</td>
              <td>{{ player.wins }}</td>
              <td>{{ player.losses }}</td>
              <td>{{ player.ties }}</td>
              <td>{{ player.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import styles from "../style.css";
// @ is an alias to /src
export default {
  name: "leaderboard",
  components: {},
  data: () => ({
    player: "",
    opponent: "",
    username: "",
    missionstatement: "",
    score: "",
    total: ""
  }),

  methods: {
    fetchLeaderboard: function() {
      fetch("http://localhost:8080/api/leaderboard", {
        method: "GET"
      })
        .then(function(response) {
          console.log(response);
          return response.json();
        })
        .then(leaderboard => {
          this.leaderboard = leaderboard;
        })

        .catch(function(error) {
          console.log(error, "<-- error!");
        });
    }
  },

  created: function() {
    this.fetchLeaderboard();
  }
};

// function getGameResult(score1, score2) {
//   return (score1 > score2) ? 'You win!'
//     : (score1 < score2) ? 'You lost!'
//     : 'It was a tie!';
// }
