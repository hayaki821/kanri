<template>
  <b-container class="fill-height" fluid>
    <b-row align="center" justify="center">
      <b-col>
        <b-card title="ログイン" class="mw-250">
          <b-card-text>
            <b-form-group label-cols-sm="3" label="ID" label-align-sm="right">
              <b-form-input
                v-model.trim="username"
                name="login"
                type="text"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label-cols-sm="3"
              label="Password"
              label-align-sm="right"
            >
              <b-form-input
                id="password"
                v-model.trim="password"
                name="password"
                type="password"
              ></b-form-input>
            </b-form-group>
          </b-card-text>
          <b-button variant="primary" @click="doLogin()">ログイン</b-button>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      username: null, // TODO ログイン実装後nullにする
      password: null
    };
  },
  methods: {
    doLogin: async function() {
      const formData = new FormData();
      formData.append("grant_type", "password");
      formData.append("client_id", 2);
      formData.append("client_secret", this.$authClientSecret);
      formData.append("username", this.username);
      formData.append("password", this.password);
      formData.append("scope", "*");
      this.post_axios("/oauth/token", formData)
        .then(response => {
          localStorage.access_token = response.data.access_token; //key
          // console.log(localStorage.vuex);
        })
        .then(() => {
          const data = {};
          const api = axios.create();
          /// getはバックで行うこともあるのでis_loadingは画面側で実装
          const config = {
            headers: {
              Authorization: "Bearer " + localStorage.access_token
            }
          };
          const category_api = api.get("api/admin_manager/category", config);
          const user_api = api.get("api/admin_manager/own", config);
          const user_level_api = api.get(
            "api/admin_manager/user/levels",
            config
          );
          axios
            .all([category_api, user_api, user_level_api])
            .then(
              axios.spread((api1Result, api2Result, api3Result) => {
                data.category = api1Result.data;
                data.user = api2Result.data;
                data.user_levels = api3Result.data;
                this.$store.dispatch("init", data);
                // console.log(localStorage);
              })
            )
            .then(() => {
              this.goHome();
            });
        })
        .catch(error => {
          console.log(error);
          this.$store.commit("RESET_VUEX_STATE");
          alert("メールアドレスまたはパスワードに間違いがあります");
        })
        .finally();
    },
    goHome: function() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style scoped>
.mw-250 {
  margin-top: 20vh;
  max-width: 450px;
}
</style>
