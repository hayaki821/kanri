<template>
  <div>
    <div v-for="menu in menus" v-show="menu.show_menu" :key="menu.title" class="nav-links">
      <div class="nav-link" @click="toggle(menu)">
        <span class="sidebar-icon">
          <font-awesome-icon :icon="menu.icon" class="mr-3" />
        </span>
        {{ menu.title }}
        <span>
          <font-awesome-icon
            icon="chevron-down"
            class="ml-3 rotate-icon"
            :rotation="menu.hide ? null : '180'"
          />
        </span>
      </div>
      <b-list-group :class="{ toggle: menu.hide }">
        <b-list-group-item
          v-for="link in menu.links"
          v-show="link.show_menu"
          :key="link.title"
          class="select-nav-link"
          :to="link.link"
          exact
        >{{ link.title }}</b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  components: {},
  props: {
    menuData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data: () => {
    return {
      menus: []
    };
  },
  computed: {},
  watch: {
    $route: {
      handler(val) {
        // $routeを監視して、変更があるたびにメニューの選択を初期化。
        // immediateを使うことでcreateの後の現在のルートを取得できる
        this.setOpenMenu();
      },
      immediate: true
    },
    menuData: {
      handler(val) {
        // 親コンポーネントから渡されるデータが変わるたびに、自コンポーネントのdataに格納
        // これをしないと常に参照状態で思わぬ不具合が起きる。
        this.menus = val;
        // メニューを受け取ったら初期化
        this.initMenus();
      },
      immediate: true
    }
  },
  created() {
    // getters.getUserLevelを監視
    // ユーザーレベルが取れ次第変更がかかる。
    this.$store.watch((state, getters) => getters.getUserLevel);
  },
  mounted() {},
  methods: {
    toggle(menu) {
      menu.hide = !menu.hide;
    },
    initMenus() {
      // 初期化
      this.setMenus();
      this.setOpenMenu();
    },
    setMenus() {
      const userlevel = 10;
      this.menus.forEach(menu => {
        menu.links.forEach(link => {
          link.show_menu = link.levels.includes(userlevel);
        });
        menu.show_menu = menu.levels.includes(userlevel);
      });
    },
    setOpenMenu() {
      // $routeは常に描画の前に更新がかかるので、この指定で現在表示しているページの名前が取れる。
      // 名前に合わせてhideを切り替える
      const path = this.$route.name;
      this.menus.forEach(menu => {
        menu.hide = menu.links.some(menu_link => {
          return menu_link && menu_link.link.name === path; //該当のものはtrueが戻る
        });
        menu.hide = !menu.hide; //hide = false で表示
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.rotate-icon {
  transition: transform 0.3s ease;
}
nav {
  cursor: pointer;
}
.toggle {
  display: none;
}
.sidebar-icon {
  font-size: 1.5rem;
}
.nav-link {
  display: flex;
  width: 250px;
  line-height: 40px;
  border-bottom: solid 1px darken(#fff, 20%);
  color: #fff;
  background-color: lighten(#000, 10%);
  transition: background-color 0.2s ease;
  &:hover {
    background-color: lighten(#000, 30%);
  }
}
.list-group-item {
  &.active {
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
  }
}
.select-nav-link {
  color: #fff;
  border-bottom: 2px solid #aaa;
  background-color: lighten(#123, 10%);
  transition: background-color 0.2s ease;
  &:hover {
    background-color: lighten(#000, 30%);
  }
}
.router-link-exact-active {
  background-color: lighten(#223, 15%);
  border-color: none;
}
</style>
