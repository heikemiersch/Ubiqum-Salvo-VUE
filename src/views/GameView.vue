<template>
  <div>
    <div class="banner">
      <div>
        <h1>+ Game View + + + Game View + + + Game View + +</h1>
      </div>
    </div>
    <!-- <div>
            <button type="submit" v-on:click="goToGameslist" style="float: right; margin-right: 10px; ">Games
                List</button>
    </div>-->

    <!-- <h1>{{ gamePlayerID }}</h1> -->
    <div class="player-banners">
      <p id="player-one">player: {{ player }}</p>
      <p id="turnthing">turn: {{ turn }}</p>
      <p id="player-two">player: {{ opponent }}</p>
    </div>

    <div class="both-grids">
      <div id="grid-one">
        <table>
          <thead>
            <th></th>
            <th v-for="column in columns">{{ column }}</th>
          </thead>
          <tbody>
            <tr v-for="row in rows">
              <th>{{ row }}</th>
              <td v-for="column in columns" v-bind:id="row + column + 'p1'">
                <drop class="drop" @drop="handleDrop"></drop>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="player-banners">
          <p v-if="shipsPlaced">Ready to go.</p>
          <p class="placeShipsRequest" v-else>Please place your ships.</p>
        </div>

        <div id="shipButtons">
          <drag
            class="drag"
            :image="require(`../img/aircraft_carrier.jpg`)"
            :transfer-data="{ example: 'heike123' }"
          >
            <!-- <button type="submit" v-on:click="placeThisShip"> -->
            <img src="../img/aircraft_carrier.jpg" />
            <!-- </button> -->
          </drag>
          <drag
            class="drag"
            :image="require(`../img/battleship.jpg`)"
            :transfer-data="{ example: 'heike123' }"
          >
            <!-- <button type="submit" v-on:click="placeThisShip"> -->
            <img src="../img/battleship.jpg" />
            <!-- </button> -->
          </drag>
          <drag
            class="drag"
            :image="require(`../img/cruiser.jpg`)"
            :transfer-data="{ example: 'heike123' }"
          >
            <!-- <button type="submit" v-on:click="placeThisShip"> -->
            <img src="../img/cruiser.jpg" />
            <!-- </button> -->
          </drag>
          <drag
            class="drag"
            :image="require(`../img/destroyer.jpg`)"
            :transfer-data="{ example: 'heike123' }"
          >
            <!-- <button type="submit" v-on:click="placeThisShip"> -->
            <img src="../img/destroyer.jpg" />
            <!-- </button> -->
          </drag>
          <drag
            class="drag"
            :image="require(`../img/submarine.jpg`)"
            :transfer-data="{ example: 'heike123' }"
          >
            <!-- <button type="submit" v-on:click="placeThisShip"> -->
            <img src="../img/submarine.jpg" />
            <!-- </button> -->
          </drag>

          <!-- <button type="submit" v-on:click="placeThisShip">Carrier (5)</button>
          <button type="submit" v-on:click="placeThisShip">Battleship (4)</button>
          <button type="submit" v-on:click="placeThisShip">Cruiser (3)</button>
          <button type="submit" v-on:click="placeThisShip">Destroyer (3)</button>
          <button type="submit" v-on:click="placeThisShip">Submarine (2)</button>-->
        </div>

        <button id="post_ships" type="submit" v-on:click="postShips">Post Ships</button>

        <!-- <div @click="placeThisShip">test clickable submarine:
                    <img src="img/submarine_small.jpg">
        </div>-->
      </div>

      <div id="grid-two">
        <table>
          <thead>
            <th></th>
            <th v-for="column in columns">{{ column }}</th>
          </thead>
          <tbody>
            <tr v-for="row in rows">
              <th>{{ row }}</th>
              <td v-for="column in columns" v-bind:id="row + column + 'p2'"></td>
            </tr>
          </tbody>
        </table>

        <!-- <div id="shipButtons">
          <button type="submit" v-on:click="placeThisShip">
            <img src="../img/submarine.jpg" />
          </button>
          <button type="submit" v-on:click="placeThisShip">
            <img src="../img/destroyer.jpg" />
          </button>
          <button type="submit" v-on:click="placeThisShip">
            <img src="../img/cruiser.jpg" />
          </button>
          <button type="submit" v-on:click="placeThisShip">
            <img src="../img/battleship.jpg" />
          </button>
          <button type="submit" v-on:click="placeThisShip">
            <img src="../img/aircraft_carrier.jpg" />
          </button>
        </div>-->

        <div class="player-banners">
          <p v-if="shipsPlaced">Ready to go.</p>
          <p class="placeShipsRequest" v-else>Opponent is placing ships.</p>
        </div>

        <!-- <button type="submit" v-on:click="postShips">Post Ships</button> -->
      </div>
    </div>
  </div>
</template>

<script>
import styles from "../style.css";
import { Drag, Drop } from "vue-drag-drop";

// @ is an alias to /src

export default {
  props: ["gpid"],
  name: "gameview",
  components: { Drag, Drop },
  data: function() {
    return {
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      destroyer: "destroyer",
      submarine: "submarine",
      carrier: "carrier",
      cruiser: "cruiser",
      battleship: "battleship",
      player: "",
      opponent: "",
      turn: null,
      ships: [],
      salvoes: [],
      salvoesOpponent: [],
      username: "",
      password: "",
      usernameSign: "",
      passwordSign: "",
      missionstatement: "",
      scores: "",
      loggedIn: false,
      authenticated: false,
      gamePlayerID: null,
      shipsPlaced: false,
      fakeShips: [
        {
          type: "carrier",
          locations: ["B2", "B3", "B4"]
        },
        {
          type: "battleship",
          locations: ["C1", "C2", "C3", "C4", "C5"]
        }
      ],
      state: ""
    };
  },

  created() {
    console.log(this.gpid);
    this.gamePlayerID = this.gpid;
    console.log("PUFF PENG PUFF");
    this.fetchData();
    //this.createShipButtons();
  },

  methods: {
    fetchData: function() {
      fetch("http://localhost:8080/api/game_view/" + this.gamePlayerID, {
        method: "GET"
      })
        .then(response => response.json())
        .then(game => {
          console.log(game);
          this.gamePlayerID = game[0].game_player_id;
          this.player = game[0].player.userName;
          this.opponent = game[0].opponent;
          this.ships = game[0].ships;
          this.salvoes = game[0].salvoes;
          this.salvoesOpponent = game[0].salvoesOpponent;

          // this.gamePlayerID = getParameterByName("gp");
          // console.log(gamePlayerId);

          this.displayTurn();
          // this.displayShips();
          this.displaySalvoes();
          this.displaySalvoesOpponent();
          console.log(this.turn);
        })
        .catch(function(error) {
          console.log(error, "<-- error");
        });
    },

    createShipButtons: function() {
      let shipButtons = document.getElementById("shipButtons");
      let carrierBtn = document.createElement("img");
      carrierBtn.setAttribute("src", "img/aircraft_carrier.jpg");
      carrierBtn.addEventListener("click", () => {
        console.log("this could be a carrier");
      });
      let battleshipBtn = document.createElement("img");
      battleshipBtn.setAttribute("src", "img/battleship.jpg");
      battleshipBtn.addEventListener("click", () => {
        console.log("this could be a battleship");
      });
      let cruiserBtn = document.createElement("img");
      cruiserBtn.setAttribute("src", "img/cruiser.jpg");
      cruiserBtn.addEventListener("click", () => {
        console.log("this could be a cruiser");
      });
      let destroyerBtn = document.createElement("img");
      destroyerBtn.setAttribute("src", "img/destroyer.jpg");
      destroyerBtn.addEventListener("click", () => {
        console.log("this could be a destroyer");
      });
      let submarineBtn = document.createElement("img");
      submarineBtn.setAttribute("src", "img/submarine.jpg");
      submarineBtn.addEventListener("click", () => {
        console.log("this could be a submarine");
      });

      shipButtons.appendChild(carrierBtn);
      shipButtons.appendChild(battleshipBtn);
      shipButtons.appendChild(cruiserBtn);
      shipButtons.appendChild(destroyerBtn);
      shipButtons.appendChild(submarineBtn);
    },

    handleChildDragstart(data, event) {
      event.stopPropagation();
    },

    handleDrop(data) {
      this.displayShips();
      alert(`You dropped with data: ${JSON.stringify(data)}`);
    },

    logout: function() {
      fetch("/api/logout", {
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

    // logout2: function() {
    //   this.logout();
    //   this.loggedIn = false;
    //   this.authenticated = false;
    // },

    logout3: function() {
      this.logout();
      this.loggedIn = false;
      this.authenticated = false;
      window.location.href = "http://localhost:8080/web/index.html?";
    },

    displayTurn() {
      this.turn = this.salvoes.length + 1;
    },

    displayShips() {
      for (i in this.ships) {
        let k = this.ships[i].shipLocation;
        for (j in k) {
          //console.log(k[j] + "p1");
          document.getElementById(k[j] + "p1").style.backgroundColor = "black";
        }
      }
    },

    // create dummyships to post to backend with this one:

    postShips: function() {
      console.log(this.fakeShips);
      fetch(
        "http://localhost:8080/api/games/players/" +
          this.gamePlayerID +
          "/ships",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json"
          },
          body: JSON.stringify(this.fakeShips)
        }
      )
        .then(response => {
          console.log(response);
          this.shipsPlaced = true;
          return response.json();
        })
        .then(data => console.log(data));
    },

    mouseover: function() {
      this.state = "X";
      console.log("you are here: " + "?");
    },

    mouseleave: function() {
      this.state = "";
    },

    displaySalvoes() {
      for (i in this.salvoes) {
        let k = this.salvoes[i].salvoLocation;
        for (j in k) {
          //console.log(k[j] + "p2");
          document.getElementById(k[j] + "p2").innerHTML = "x";
          document.getElementById(k[j] + "p2").style.color = "red";
          document.getElementById(k[j] + "p2").style.textAlign = "center";
        }
      }
    },

    displaySalvoesOpponent() {
      for (i in this.salvoesOpponent) {
        let k = this.salvoesOpponent[i].salvoLocation;
        for (j in k) {
          //console.log(k[j] + "p1");
          document.getElementById(k[j] + "p1").innerHTML = "x";
          document.getElementById(k[j] + "p1").style.color = "red";
          document.getElementById(k[j] + "p1").style.textAlign = "center";
        }
      }
    }
  }
};
</script>
