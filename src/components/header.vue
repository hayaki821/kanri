<template>
  <b-navbar class="navbar navbar-expand-lg navbar-dark bg-dark">
    <router-link to="/" class="navbar-brand left">管理システム</router-link>
    <b-button v-b-toggle.sidebar-toggler class="left">
      <font-awesome-icon icon="bars" />
    </b-button>
    <b-collapse id="navbarSupportedContent" class="collapse navbar-collapse">
      <b-navbar-nav class="navbar-nav mr-auto w-100 justify-content-end">
        <b-nav-item class="nav-item">
          <p class="username">{{ userName }}</p>
        </b-nav-item>
        <b-nav-item class="nav-item">
          <b-button variant="primary" sm @click="logout">ログアウト</b-button>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  data: () => {
    return {
      userName: ""
    };
  },
  created() {
    // getters.getUserNameを監視
    // ユーザーレベルが取れ次第変更がかかる。
    this.setUserName();
    this.$store.watch(
      (state, getters) => getters.getUserLevel,
      (newValue, oldValue) => {
        if (newValue) {
          this.initMenus();
        }
      }
    );
  },
  methods: {
    initMenus() {
      this.setUserName();
    },
    setUserName() {
      this.userName = this.$store.getters.getUserName;
    }
  }
};
</script>
<style scoped>
.left {
  margin-left: 50px;
}
.navbar-brand::after {
  content: "";
  width: 0;
  transition: all 0.3s ease;
  display: block;
  bottom: 0;
  margin: -3px;
  border-bottom: 3px solid white;
}

.navbar-brand:hover::after {
  width: 100%;
}
.username {
  color: #fff;
  font-weight: bold;
  margin-top: 9px;
}
</style>
