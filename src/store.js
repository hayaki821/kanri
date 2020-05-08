import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
export const initialState = {
  loading: false,
  category: [],
  user: {
    level: 10,
    name: "master",
  },
};

export default new Vuex.Store({
  state: initialState,
  mutations: {
    isloading(state, data) {
      state.loading = data;
    },
    setCategory(state, data) {
      // 1:地点共通分類
      // 2:観光施設分類
      // 3:店舗ジャンル分類
      // 4:作品分類
      // 5:エリア
      // 6:モデルコース分類
      // 7:特集分類
      // 8:支払い方法
      state.category = data;
    },
    setUser(state, data) {
      state.user = data;
    },
    setUserLevels(state, data) {
      state.user_levels = data;
    },
    RESET_VUEX_STATE(state) {
      Object.assign(state, JSON.parse(localStorage.getItem("initialState")));
    },
  },
  actions: {
    init(state, data) {
      // 非同期処理や外部APIと通信など
      this.commit("setCategory", data.category);
      this.commit("setUser", data.user);
      this.commit("setUserLevels", data.user_levels);
    },
  },
  getters: {
    getIsLoading(state) {
      return state.loading;
    },
    getCategoryByGroupID: (state) => (group) => {
      return state.category.filter((elem) => {
        return elem.group == group;
      });
    },
    getUserLevel(state) {
      return state.user ? state.user.level : null;
    },
    getUserLevels(state) {
      return state.user_levels ? state.user_levels : null;
    },
    getUserName(state) {
      return state.user ? state.user.name : null;
    },
  },
  plugins: [createPersistedState()],
});
