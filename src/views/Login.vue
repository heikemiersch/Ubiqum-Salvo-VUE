<template>
  <div>
    <div class="banner">
      <h2>+ Sign up or log in to play + + + Sign up or log in</h2>
    </div>
    <div>
      <form onsubmit="return false">
        <input type="text" v-model="username" placeholder="Please enter Username" />
        <input type="text" v-model="password" placeholder="Please enter Password" />
        >>>
        <button type="submit" v-on:click="login">Log in</button>

        <!-- <span v-if="loggedIn == true">
        <button type="submit" v-on:click="logout2">Log out</button>
        </span>-->

        <input type="text" v-model="usernameSign" placeholder="Please enter Username" />
        <input type="text" v-model="passwordSign" placeholder="Please enter Password" />
        <input
          type="text"
          id="missionstatement"
          v-model="missionstatement"
          placeholder="Please enter your Mission Statement"
        />
        <!-- <input type="text" style="background-color:  rgb(213, 235, 178);;"> -->
        >>>
        <button type="submit" v-on:click="signup">Sign up</button>
      </form>
    </div>
  </div>
</template>

<script>
import styles from "../style.css";

export default {
  name: "login",
  components: {},

  data: function() {
    return {
      username: "",
      password: "",
      usernameSign: "",
      passwordSign: "",
      missionstatement: "",
      loggedIn: false,
      authenticated: false
    };
  },
  methods: {
    signup() {
      // console.log(this.username);
      // console.log(this.password);
      fetch("http://localhost:8080/api/register", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",

          "Content-type": "application/x-www-form-urlencoded"
        },
        body: `userName=${this.usernameSign}&password=${this.passwordSign}&missionstatement=${this.missionstatement}`
      }).then(response => {
        console.log(response);
        if (response.status == 201) {
          this.username = this.usernameSign;
          this.password = this.passwordSign;
          this.login();
          console.log("signed up you are!");
        } else if (response.status !== 201) {
          console.log(response.status);
          alert("that username already in use. please make a new choice.");
          this.resetInput();
        }
      });
    },

    resetInput() {
      this.username = "";
      this.password = "";
      this.usernameSign = "";
      this.passwordSign = "";
      this.missionstatement = "";
    },

    login() {
      console.log(this.username);
      console.log(this.password);
      fetch("http://localhost:8080/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",

          "Content-type": "application/x-www-form-urlencoded"
        },
        body: `userName=${this.username}&password=${this.password}`
      }).then(response => {
        if (response.status == 200) {
          console.log("logged in");
          this.authenticated = true;
          this.loggedIn = true;
          window.location.href = "/gameslist";
          // this.fetchData();
        } else {
          alert("invalid login. please sign up first.");
          window.location.reload();
        }
      });
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
      window.location.href = "http://localhost:8080/web/index.html?";
    }
  },
  created() {}
};
</script>