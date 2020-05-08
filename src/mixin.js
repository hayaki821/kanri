import axiosBase from "axios";
import store from "./store";
import moment from "moment";

const axios = axiosBase.create({
  baseURL: process.env.MIX_API_BASE
});

export default {
  data() {
    return {
      loadtext: "ロード中です。しばらくおまちください",
      passwordRule: [
        v => !!v || "パスワードは必須です",
        v => (v && v.length >= 8) || "パスワードは8文字以上です"
      ],
      password2Rule: [
        v => !!v || "パスワード(確認用)は必須です",
        v => (v && v.length >= 8) || "パスワードは8文字以上です",
        v => v === this.form.password || "パスワードが一致していません"
      ],
      passwordRuleWithId: [
        v => (v ? (v && v.length >= 8) || "パスワードは8文字以上です" : null)
        // v => v === this.form.password2 || 'パスワードが一致していません'
      ],
      password2RuleWithId: [
        // v => (v && v.length >= 8) || 'パスワードは8文字以上です'
        v => v === this.form.password || "パスワードが一致していません"
      ]
    };
  },
  props: {
    rules: {
      type: Object,
      default: () => ({
        required: [
          v => !!v || "必須です",
          v => (v ? v.trim() !== "" || "空白のみは無効です" : "")
        ],
        selectRules: [v => !!v || "選択してください"]
      })
    }
  },
  mounted() {},
  methods: {
    is_loading(bool) {
      bool = bool || false;
      store.commit("isloading", bool);
    },
    message_snackbar(text = "", title = "") {
      this.makeToast(text);
    },
    error_snackbar(message) {
      this.makeToast("エラーが発生しました" + message, "通信エラー", "danger");
    },
    makeToast(text = "", title = "", variant = "primary", append = false) {
      this.toastCount++;
      this.$bvToast.toast(text, {
        title: title,
        autoHideDelay: 5000,
        variant: variant,
        appendToast: append
      });
    },
    setOptions(key) {
      // keyを元にstoreからオプションマスターを取得する。
      let category = [];
      let options = [];
      switch (key) {
        case "purpose_category_id":
          category = this.$store.getters.getCategoryByGroupID(1);
          break;
        case "place_category_id":
          category = this.$store.getters.getCategoryByGroupID(2);
          break;
        case "shop_category_id":
          category = this.$store.getters.getCategoryByGroupID(3);
          break;
        case "spot_works":
          category = this.$store.getters.getCategoryByGroupID(4);
          break;
        case "spot_area_id":
          category = this.$store.getters.getCategoryByGroupID(5);
          break;
        case "course_category_id":
          category = this.$store.getters.getCategoryByGroupID(6);
          break;
        case "topic_category_id":
          category = this.$store.getters.getCategoryByGroupID(7);
          break;
        case "spot_payment_ways":
          category = this.$store.getters.getCategoryByGroupID(8);
          break;
        default:
          break;
      }
      options = category.map(elem => {
        return { value: elem.id, text: elem.label };
      });
      return options;
    },
    searchAddress(postalCode, prefectureList) {
      const url = "https://api.zipaddress.net/?zipcode=";
      return fetch(url + postalCode, {
        method: "GET"
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log("check in mixin ", data.data);
          const pref = data.data.pref;
          const prefs = prefectureList.find(item => {
            return pref === item.name;
          });
          return {
            prefecture_id: prefs.id,
            city: data.data.city,
            address: data.data.town
          };
        });
    },
    orderupArray(dataArray, index) {
      const res = Object.assign([], dataArray);
      if (index < 1) return res;
      res.splice(index - 1, 2, res[index], res[index - 1]);
      return res;
    },
    orderdownArray(dataArray, index) {
      const res = Object.assign([], dataArray);
      if (res.length - 1 <= index) return res;
      res.splice(index, 2, res[index + 1], res[index]);
      return res;
    },

    async get_axios(url, params = null) {
      // getはバックで行うこともあるのでis_loadingは画面側で実装
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.access_token
        },
        params: {}
      };
      if (params) {
        config.params = params;
      }
      try {
        return await axios.get(url, config);
      } catch (error) {
        this.error_axios(error);
      }
    },
    // Axios post
    async post_axios(url, formData, header, background = false) {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.access_token,
          ...header
        }
      };

      if (!background) this.is_loading(true);
      try {
        return await axios.post(url, formData, config).then(res => {
          // TODO 完了表示
          if (!background) this.message_snackbar("保存しました");
          return res;
        });
      } catch (error) {
        if (!background) this.error_axios(error);
      } finally {
        if (!background) this.is_loading(false);
      }
    },
    // Axios put
    async put_axios(url, formData, header, background = false) {
      // this.is_loading(true)
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.access_token
        }
      };
      config.headers["X-HTTP-Method-Override"] = "PUT";
      if (!background) this.is_loading(true);
      try {
        return await axios.post(url, formData, config).then(res => {
          if (!background) this.message_snackbar("編集しました");
          return res;
        });
      } catch (error) {
        if (!background) this.error_axios(error);
      } finally {
        if (!background) this.is_loading(false);
      }
    },
    // Axios delete
    async delete_axios(url) {
      // this.is_loading(true)
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.access_token
        }
      };
      config.headers["X-HTTP-Method-Override"] = "PUT";
      this.is_loading(true);
      try {
        return await axios.delete(url, config).then(res => {
          this.message_snackbar("削除しました");
          return res;
        });
      } catch (error) {
        this.error_axios(error);
      } finally {
        this.is_loading(false);
      }
    },
    async axios_all(apis) {
      const api = axiosBase.create();
      const allApi = [];
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.access_token
        }
      };
      // getはバックで行うこともあるのでis_loadingは画面側で実装
      apis.get.forEach(elem => {
        allApi.push(api.get(...elem, config));
      });
      apis.post.forEach(elem => {
        allApi.push(api.post(...elem, config));
      });
      apis.put.forEach(elem => {
        allApi.push(api.put(...elem, config));
      });
      axiosBase
        .all(allApi)
        .then(res => {
          return true;
        })
        .catch(error => {
          this.error_axios(error);
          return false;
        });
    },
    error_axios(error) {
      // if (localStorage.error_status === 'error') return
      if (localStorage.access_token !== "" && error.response.status === 401) {
        // localStorage.error_status = 'error' // エラーステータス保持
        // let message = '' // TODO 追加エラーメッセージ
        // this.error_popup_message(error, message) // TODO 追加エラーメッセージ
        console.log(error.response.data);
        if (localStorage.access_token) {
          localStorage.access_token = "";
        }
        this.$store.commit("setUser", null);
        alert("エラーが発生しました。ログアウトします");
        this.$router.push({ name: "ログイン" });
      } else if (error.response.status === 403) {
        const mes = JSON.stringify(error.response.data.errors);
        this.error_snackbar(error.response.data.errors);
        this.$router.push({ name: "memberhome" });
      } else if (error.response.status !== 401) {
        const mes = JSON.stringify(error.response.data.errors);
        this.error_snackbar(mes);
        // this.error_popup_message(error)
        throw error.response;
      }
    },
    logout() {
      // if (localStorage.error_status === 'error') return
      if (window.confirm("ログアウトします。よろしいですか")) {
        this.post_axios("/api/admin_manager/logout").then(response => {
          console.log(response.data.success === "logout_success");
          if (response.data.success === "logout_success") {
            this.$store.commit("RESET_VUEX_STATE");
            localStorage.access_token = "";
            this.$store.commit("setUser", null);
            this.$router.push({ name: "ログイン" });
            console.log(localStorage.vuex);
          }
        });
      }
    }
  }
};
