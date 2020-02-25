<template>
  <div class="template_div">
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
    <div v-if="gameover" class="player-banners">GAME OVER</div>

    <div class="both-grids">
      <div id="grid-one">
        <table>
          <thead>
            <th></th>
            <th v-for="column in columns" :key="column.id">{{ column }}</th>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <th>{{ row }}</th>
              <td v-for="column in columns" :key="column.id" v-bind:id="row + column">
                <drop class="drop" @drop="handleDrop" v-bind:id="row + column"></drop>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="player-banners">
          <p v-if="shipsPlaced">Ready to go.</p>
          <p class="placeShipsRequest" v-else>Please place your ships.</p>
        </div>

        <div v-if="!shipsPlaced" class="shipButtons">
          <drag
            id="carrier"
            class="drag"
            :image="require(`../img/aircraft_carrier.jpg`)"
            :transfer-data="{ shiptype:carrier }"
          >
            <!-- <button type="submit" v-on:click="placeThisShip"> -->
            <img src="../img/aircraft_carrier.jpg" />
            <!-- </button> -->
          </drag>
          <drag
            id="battleship"
            class="drag"
            :image="require(`../img/battleship.jpg`)"
            :transfer-data="{ shiptype:battleship }"
          >
            <!-- <button type="submit" v-on:click="placeThisShip"> -->
            <img src="../img/battleship.jpg" />
            <!-- </button> -->
          </drag>
          <drag
            id="cruiser"
            class="drag"
            :image="require(`../img/cruiser.jpg`)"
            :transfer-data="{ shiptype:cruiser }"
          >
            <!-- <button type="submit" v-on:click="placeThisShip"> -->
            <img src="../img/cruiser.jpg" />
            <!-- </button> -->
          </drag>
          <drag
            id="destroyer"
            class="drag"
            :image="require(`../img/destroyer.jpg`)"
            :transfer-data="{ shiptype:destroyer }"
          >
            <!-- <button type="submit" v-on:click="placeThisShip"> -->
            <img src="../img/destroyer.jpg" />
            <!-- </button> -->
          </drag>
          <drag
            id="submarine"
            class="drag"
            :image="require(`../img/submarine.jpg`)"
            :transfer-data="{ shiptype:submarine }"
          >
            <!-- <button type="submit" v-on:click="placeThisShip"> -->
            <img src="../img/submarine.jpg" />
            <!-- </button> -->
          </drag>
        </div>
        <div class="radio">
          <input type="radio" v-model="alignment" v-bind:value="horizontally" />horizontally
          <input type="radio" v-model="alignment" v-bind:value="vertically" />vertically
          <br />
          <p class="noshow">ships are placed: {{alignment}}</p>
        </div>

        <div class="submit_buttons">
          <button class="post_ships" type="submit" v-on:click="resetShips">Reset Ships</button>
          <button class="post_ships" type="submit" v-on:click="postShips">Post Ships</button>
          <button class="post_ships" type="submit" v-on:click="postSalvoes">Post Salvoes</button>
          <button class="post_ships" type="submit" v-on:click="resetSalvoes">Reset Salvoes</button>
        </div>
      </div>

      <div id="grid-two">
        <table>
          <thead>
            <th></th>
            <th v-for="column in columns" :key="column.id">{{ column }}</th>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <th>{{ row }}</th>
              <td
                v-for="column in columns"
                :key="column.id"
                v-on:click="shoot(row, column)"
                v-bind:id="row + column + 'p2'"
              ></td>
            </tr>
          </tbody>
        </table>

        <!-- <div class="player-banners">
          <p v-if="shipsPlaced">Ready to go.</p>
        <p class="placeShipsRequest" v-else>Opponent is placing ships.</p>-->
      </div>
    </div>
  </div>
</template>

<script>
import styles from "../style.css";
import { Drag, Drop } from "vue-drag-drop";

// @ is an alias to /src

export default {
  props: ["id"],
  name: "gameview",
  components: { Drag, Drop },
  data: function() {
    return {
      rows: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      columns: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      cellId: "",
      alignment: "horizontally",
      horizontally: "horizontally",
      vertically: "vertically",
      destroyer: "destroyer",
      submarine: "submarine",
      carrier: "carrier",
      cruiser: "cruiser",
      battleship: "battleship",
      player: "",
      opponent: "",
      turn: 1,
      salvoes: [],
      newSalvo: {
        turn: 0,
        salvoLocation: []
      },
      salvoLocations: [],
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
      ships: [],
      hits: [],
      gameover: false
    };
  },

  created() {
    console.log(this.ships);

    // console.log(this.$route.params.id);
    // works ↓↓↓↓↓↓↓↓
    // console.log(this.id);

    this.gamePlayerID = this.id;
    this.fetchData();
    console.log(this.shipsPlaced);
  },

  methods: {
    fetchData: function() {
      fetch("http://localhost:8080/api/game_view/" + this.gamePlayerID, {
        method: "GET"
      })
        .then(response => {
          // console.log(response);
          return response.json();
        })
        .then(game => {
          console.log(game);
          this.gamePlayerID = game[0].game_player_id;
          this.player = game[0].player.userName;
          this.opponent = game[0].opponent;
          this.ships = game[0].ships;
          console.log(this.ships);
          this.salvoes = game[0].salvoes;
          this.hits = game[0].hits;
          this.turn = game[0].turn;
          this.gameover = game[0].gameover;
          this.salvoesOpponent = game[0].salvoesOpponent;
          // console.log(this.ships);
          // this.gamePlayerID = getParameterByName("gp");
          // console.log(gamePlayerId);

          this.displayShips();
          this.displaySalvoes();
          this.displaySalvoesOpponent();
          this.displayHits();
          // console.log(this.turn);
          if (this.ships.length > 0) {
            this.shipsPlaced = true;
          } else {
            this.shipsPlaced = false;
          }
        })
        .catch(function(error) {
          console.log(error, "<-- error");
        });
    },

    handleChildDragstart(data, event) {
      event.stopPropagation();
    },

    handleDrop(data, event) {
      this.placeShips(data, event);

      // console.log(event);
      // console.log(`${JSON.stringify(data)}`);
    },

    placeShips(data, event) {
      function shipsLength() {
        switch (data.shiptype) {
          case "carrier":
            document.getElementById("carrier").style.display = "none";
            // console.log(data.shiptype);
            // console.log(shipLocation);
            return 4;
            break;
          case "battleship":
            document.getElementById("battleship").style.display = "none";
            return 5;
            break;
          case "cruiser":
            document.getElementById("cruiser").style.display = "none";
            return 2;
            break;
          case "destroyer":
            document.getElementById("destroyer").style.display = "none";
            return 3;
            break;
          case "submarine":
            document.getElementById("submarine").style.display = "none";
            return 3;
            break;
        }
      }

      let dropPosition = event.currentTarget.id;
      let shipType = data.shiptype;
      let cellIdFirstNumber = dropPosition[0];
      let cellIdSecondNumber = dropPosition[1];
      let cellId = cellIdFirstNumber + cellIdSecondNumber;

      if (
        document.getElementById(dropPosition).style.backgroundColor !==
          "grey" &&
        this.alignment === "horizontally"
      ) {
        if (cellIdSecondNumber <= 10 - shipsLength()) {
          this.shipLocation = [];
          for (var i = 0; i < shipsLength(); i++) {
            let onemore = parseInt(cellIdSecondNumber) + i;
            let cellidToTheRight = cellIdFirstNumber + onemore;
            document.getElementById(cellidToTheRight).style.backgroundColor =
              "grey";
            this.shipLocation.push(cellidToTheRight);
          }
          this.ships.push({
            type: data.shiptype,
            shipLocation: this.shipLocation
          });
        } else {
          this.shipLocation = [];
          for (var i = 0; i < shipsLength(); i++) {
            let oneless = parseInt(cellIdSecondNumber) - i;
            let cellidToTheLeft = cellIdFirstNumber + oneless;
            document.getElementById(cellidToTheLeft).style.backgroundColor =
              "grey";
            this.shipLocation.push(cellidToTheLeft);
          }
          this.ships.push({
            type: data.shiptype,
            shipLocation: this.shipLocation
          });
        }
      } else if (
        document.getElementById(dropPosition).style.backgroundColor !==
          "grey" &&
        this.alignment === "vertically"
      ) {
        if (cellIdFirstNumber <= 10 - shipsLength()) {
          this.shipLocation = [];
          for (var j = 0; j < shipsLength(); j++) {
            let onedown = parseInt(cellIdFirstNumber) + j;
            let cellidUnderneath = onedown + cellIdSecondNumber;
            document.getElementById(cellidUnderneath).style.backgroundColor =
              "grey";
            this.shipLocation.push(cellidUnderneath);
          }
          this.ships.push({
            type: data.shiptype,
            shipLocation: this.shipLocation
          });
        } else {
          for (var j = 0; j < shipsLength(); j++) {
            this.shipLocation = [];
            let oneup = parseInt(cellIdFirstNumber) - j;
            let cellidAbove = oneup + cellIdSecondNumber;
            document.getElementById(cellidAbove).style.backgroundColor = "grey";
            this.shipLocation.push(cellidAbove);
          }
          this.ships.push({
            type: data.shiptype,
            shipLocation: this.shipLocation
          });
        }
      }

      console.log("ships: " + this.ships);
    },

    logout: function() {
      fetch("/api/logout", {
        method: "POST"
      }).then(response => {
        if (response.status == 200) {
          console.log("logout successful");
        }
      });
    },

    logout3: function() {
      this.logout();
      this.loggedIn = false;
      this.authenticated = false;
      window.location.href = "http://localhost:8080/web/index.html?";
    },

    // displayTurn() {
    //   this.turn = this.salvoes.length + 1;
    //   // works ↓↓↓↓↓↓↓↓
    //   // console.log(this.salvoes.length);
    // },

    displayShips() {
      for (var i in this.ships) {
        let k = this.ships[i].shipLocation;
        for (var j in k) {
          //console.log(k[j] + "p1");
          document.getElementById(k[j]).style.backgroundColor =
            " rgb(36, 36, 36)";
        }
      }
    },

    resetShips: function() {
      // BAD IDEA ↓↓↓↓↓↓↓↓
      // besser: die arrays löschen, die sich in diesem turn angefüllt haben
      // und ebenso für die resetSalvoes
      //  this.shipsPlaced = false;
      //  this.ships = [];
      location.reload();
    },

    resetSalvoes() {
      // BAD IDEA ↓↓↓↓↓↓↓↓
      location.reload();
    },

    postShips: function() {
      console.log(this.ships);
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
          body: JSON.stringify(this.ships)
        }
      )
        .then(response => {
          console.log(response);
          // console.log(this.ships);
          this.shipsPlaced = true;
          // console.log(this.shipsPlaced);
          return response.json();
        })
        .then(data => console.log(data))
        .then(data => this.ships.push(data));
      location.reload();
      // console.log(this.ships);
    },

    postSalvoes: function() {
      this.newSalvo.turn = this.turn;
      this.newSalvo.salvoLocation = this.salvoLocations;
      // console.log(JSON.stringify(this.newSalvo));
      // let foo = JSON.stringify([{"turn": 2, salvoLocation: ["B2"], id:7}])
      // console.log('foo :', foo);
      fetch(
        "http://localhost:8080/api/games/players/" +
          this.gamePlayerID +
          "/salvoes",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json"
          },
          body: JSON.stringify(this.newSalvo)
        }
      ).then(response => {
        console.log(response);
        location.reload();
        //return response.json();
      });
      // .then(data => console.log(data));
    },

    shoot(row, column, salvoLocations) {
      let salvoPosition = row + column + "p2";
      if (
        document.getElementById(salvoPosition).style.color !== "black" &&
        document.getElementById(salvoPosition).style.color !== "grey" &&
        document.getElementById(salvoPosition).style.color !== "red"
      ) {
        // works ↓↓↓↓↓↓↓↓
        console.log(salvoPosition);
        for (var i = 0; i < 3; i++) {
          document.getElementById(salvoPosition).innerHTML = "*";
          document.getElementById(salvoPosition).style.color = "grey";
        }
        this.salvoLocations.push(row + column);
        console.log(this.newSalvo);
        console.log(this.salvoes);
      }
    },

    displaySalvoes() {
      for (var i in this.salvoes) {
        let k = this.salvoes[i].salvoLocation;
        for (var j in k) {
          // console.log(k[j] + "p2");

          document.getElementById(k[j] + "p2").innerHTML = "*";
          document.getElementById(k[j] + "p2").style.color = "black";
          // document.getElementById(k[j] + "p2").style.textAlign = "center";
        }
      }
    },

    displayHits() {
      for (var i in this.hits) {
        console.log("hits", this.hits);
        let k = this.hits;
        for (var j in k) {
          console.log(this.hits);
          document.getElementById(k[j] + "p2").innerHTML = "*";
          document.getElementById(k[j] + "p2").style.color = "red";
        }
      }
    },

    displaySalvoesOpponent() {
      for (var i in this.salvoesOpponent) {
        let k = this.salvoesOpponent[i].salvoLocation;
        for (var j in k) {
          //console.log(k[j]);
          document.getElementById(k[j]).innerHTML = "*";
          document.getElementById(k[j]).style.color = "black";
          // document.getElementById(k[j]).style.textAlign = "center";
        }
      }
    }

    // mounted() {
    //   fetchData();
    // }
  }
};
</script>
