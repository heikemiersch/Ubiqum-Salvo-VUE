<template>
  <div>
    <div class="banner">
      <h3>+ List of Games + + + List of Games + + + List of Games + +</h3>
    </div>

    <div class="column_one">
      <ul id="listOfGames"></ul>
    </div>

    <div class="column_two">
      <p>
        Wanna play? Join a game or create a new one and wait for someone to accept the challenge.
        Go to leaderboard to have a look at the total score. Or log out and join again later.
      </p>
      <button @click="createGame">New Game</button>
      <button @click="goToLeaderboard">Leaderboard</button>
      <button @click="logout3">Log out</button>
    </div>
  </div>
</template>

<script>
import styles from "../style.css";
// @ is an alias to /src
export default {
  props: ["gpid"],
  name: "gameslist",
  components: {},

  created() {
    this.fetchGamesListData();
    // console.log("COMPUTED");
  },

  data: () => ({
    //login: this.login,
    player: "",
    opponent: "",
    username: "",
    score: "",
    missionstatement: "",
    loggedIn: false,
    authenticated: false,
    gamePlayerID: null
  }),

  methods: {
    fetchGamesListData() {
      fetch("http://localhost:8080/api/games", {
        method: "GET",
        credentials: "include"
      })
        .then(function(response) {
          console.log(response);
          return response.json();
        })
        .then(response => {
          console.log(response);
          let gamesList = response;
          this.createList(gamesList);
        })

        .catch(function(error) {
          console.log(error, "<-- error!");
        });
    },

    createList(gamesList) {
      gamesList.sort((a, b) => b.game_id - a.game_id);
      console.log(gamesList);
      let list = document.getElementById("listOfGames");
      list.innerHTML = "";

      for (let i = 0; i < gamesList.length; i++) {
        let line = document.createElement("div");
        line.innerHTML = "----------------------------------";
        let listItemGameId = document.createElement("li");
        listItemGameId.innerHTML = "Game " + gamesList[i].game_id;

        let listItemCreationDate = document.createElement("li");
        listItemCreationDate.innerHTML = "Date: " + gamesList[i].creation_date;

        list.appendChild(line);
        list.appendChild(listItemGameId);
        list.appendChild(listItemCreationDate);

        for (let j = 0; j < gamesList[i].game_player.length; j++) {
          let listItemPlayerUsername = document.createElement("li");
          listItemPlayerUsername.innerHTML =
            "Username: " + gamesList[i].game_player[j].player[0].username;

          let missionstatement = document.createElement("li");
          missionstatement.innerHTML =
            "Mission: " +
            gamesList[i].game_player[j].player[0].missionstatement;

          let listItemScore = document.createElement("li");
          listItemScore.innerHTML =
            "Score: " + gamesList[i].game_player[j].player[0].total;

          list.appendChild(listItemPlayerUsername);
          list.appendChild(missionstatement);
          list.appendChild(listItemScore);
        }

        if (gamesList[i].game_player.length < 2) {
          let joinButton = document.createElement("button");
          let buttonDiv = document.createElement("div");
          joinButton.innerHTML = "Join Game";
          joinButton.appendChild(buttonDiv);
          list.appendChild(joinButton);

          joinButton.addEventListener("click", () => {
            this.joinGame(gamesList[i].game_id);
          });
        }
      }
    },

    resetInput() {
      this.username = "";
      this.password = "";
      this.usernameSign = "";
      this.passwordSign = "";
      this.missionstatement = "";
    },

    logout() {
      fetch("http://localhost:8080/api/logout", {
        method: "POST"
        // credentials: "include",
        // headers: {
        //   Accept: "application/json",
        //   "Content-type": "application/x-www-form-urlencoded"
        // },
        // body: `userName=${this.username}&password=${this.password}`
      }).then(response => {
        if (response.status == 200) {
          console.log("logout successful");
        }
      });
    },

    logout2() {
      this.logout();
      this.loggedIn = false;
      this.authenticated = false;
    },

    logout3() {
      this.logout();
      this.loggedIn = false;
      this.authenticated = false;
      window.location.href = "/";
    },

    goToLeaderboard() {
      window.open("http://localhost:8081/web/leaderboard.html?");
      // window.location.href = "http://localhost:8080/web/leaderboard.html?";
    },

    createGame() {
      fetch("http://localhost:8080/api/games", {
        method: "POST",
        credentials: "include"

        // headers: {
        //   Accept: "application/json",
        //   "Content-type": "application/x-www-form-urlencoded"
        // }
      })
        .then(response => {
          console.log(response);
          if (response.status == 201) {
            console.log("you just created a game.");
            return response.json();
          } else {
            alert("sorry, no game created.");
          }
        })
        .then(res => {
          if (res.id) {
            console.log(res);
            console.log(res.id);

            // window.open("http://localhost:8080/web/game.html?gp=" + res.id);
          }
        })
        .catch(error => console.log(error));
    },

    joinGame(gameId) {
      console.log(gameId);
      fetch(`http://localhost:8080/api/games/join`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `gameId=${gameId}`
      })
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(res => {
          console.log(res);
          if (res.id) {
            this.gamePlayerID = res.id;
            this.$emit("gamePlayerId", { gpid: res.id });
            this.$router.push({ name: "gameview", params: { gpid: res.id } });
            // console.log(this.$route.params);
            // window.location.href = "/gameview";
            // window.open(`game.html?gp=${res.id}`);
          }
        });
    },

    gameview() {
      //displayShips();
      window.location.href =
        "http://localhost:8080/web/game.html?gp=" + this.gamePlayerID;
    },

    goToGameslist() {
      window.location.href = "http://localhost:8080/web/games.html?";
    }
  }
};
</script>