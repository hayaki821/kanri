<template>
  <div class="container pt-5 bg-white">
    <h1 class="display-5 title-cs">
      <font-awesome-icon icon="tachometer-alt" class="title-icon" />管理システム
    </h1>
    <hr />
    <b-row>
      <b-col
        v-for="menu in menus"
        v-show="menu.show_menu"
        :key="menu.header"
        cols="12"
        sm="6"
        class="mb-5"
      >
        <b-card
          :border-variant="menu.variant"
          :header="menu.header"
          :header-bg-variant="menu.variant"
          header-text-variant="white"
          class="text-center h-100"
        >
          <b-card-text>
            <b-row align-h="center" align-content="stretch">
              <b-col
                v-for="child_home in menu.child_homes"
                v-show="child_home.show_menu"
                :key="child_home.header"
                class="mw-20rem"
              >
                <router-link :to="child_home.link" class="text-white">
                  <b-card
                    :bg-variant="child_home.variant"
                    text-variant="white"
                    :header="child_home.header"
                    class="text-center h-100"
                  >
                    <b-card-text>
                      <font-awesome-icon :icon="child_home.icon" class="content-icon" />.
                    </b-card-text>
                  </b-card>
                </router-link>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menus: [
        {
          header: "各種カテゴリ　管理",
          variant: "primary",
          levels: [10, 9],
          show_menu: false,
          child_homes: [
            {
              header: "カテゴリ一覧",
              variant: "dark",
              link: { name: "category" },
              levels: [10, 9, 7, 5],
              show_menu: false,
              icon: "folder-open"
            },
            {
              header: "カテゴリの新規追加",
              variant: "dark",
              link: { name: "add_category" },
              levels: [10, 9, 7, 5],
              show_menu: false,
              icon: "plus-square"
            }
          ]
        },
        {
          header: "タグ　管理",
          variant: "success",
          levels: [10, 9, 7, 5],
          child_homes: [
            {
              header: "タグ一覧",
              variant: "dark",
              link: { name: "tag" },
              levels: [10, 9, 7, 5],
              icon: "tags"
            },
            {
              header: "タグ新規追加",
              variant: "dark",
              link: { name: "add_tag" },
              levels: [10, 9, 7, 5],
              icon: "plus-square"
            }
          ]
        },
        {
          header: "ユーザー　管理",
          variant: "warning",
          levels: [10, 9, 7, 5],
          show_menu: false,
          child_homes: [
            {
              header: "ユーザーリスト",
              variant: "dark",
              link: { name: "user" },
              levels: [10, 9, 7, 5],
              show_menu: false,
              icon: "user"
            },
            {
              header: "ユーザーの新規追加",
              variant: "dark",
              link: { name: "add_user" },
              levels: [10, 9],
              show_menu: false,
              icon: "plus-square"
            }
          ]
        },
        {
          header: "スポット　管理",
          variant: "primary",
          levels: [10, 9, 7],
          show_menu: false,
          child_homes: [
            {
              header: "スポットのリスト",
              variant: "dark",
              link: { name: "spot" },
              levels: [10, 9, 7],
              show_menu: false,
              icon: "map-marked-alt"
            },
            {
              header: "スポットの新規追加",
              variant: "dark",
              link: { name: "add_spot" },
              levels: [10, 9, 7],
              show_menu: false,
              icon: "plus-square"
            },
            {
              header: "お知らせの新規追加",
              variant: "dark",
              link: { name: "add_SpotInformation" },
              levels: [10, 9, 5],
              show_menu: false,
              icon: "plus-square"
            }
          ]
        },
        {
          header: "モデルコース　管理",
          variant: "success",
          levels: [10, 9, 5],
          show_menu: false,
          child_homes: [
            {
              header: "モデルコースのリスト",
              variant: "dark",
              link: { name: "course" },
              levels: [10, 9, 5],
              show_menu: false,
              icon: "road"
            },
            {
              header: "モデルコースの新規追加",
              variant: "dark",
              link: { name: "add_course" },
              levels: [10, 9, 5],
              show_menu: false,
              icon: "plus-square"
            }
          ]
        },
        {
          header: "特集記事　管理",
          variant: "warning",
          levels: [10, 9, 5],
          show_menu: false,
          child_homes: [
            {
              header: "特集記事リスト",
              variant: "dark",
              link: { name: "topic" },
              levels: [10, 9, 5],
              show_menu: false,
              icon: "file-alt"
            },
            {
              header: "特集記事の新規追加",
              variant: "dark",
              link: { name: "add_topic" },
              levels: [10, 9, 5],
              show_menu: false,
              icon: "plus-square"
            }
          ]
        },
        {
          header: "お知らせ管理",
          variant: "primary",
          levels: [9, 10],
          show_menu: false,
          child_homes: [
            {
              header: "お知らせ一覧",
              variant: "dark",
              link: { name: "list_news" },
              levels: [10, 9],
              show_menu: false,
              icon: "newspaper"
            },
            {
              header: "お知らせの新規追加",
              variant: "dark",
              link: { name: "add_news" },
              levels: [10, 9],
              show_menu: false,
              icon: "plus-square"
            }
          ]
        },
        {
          header: "イベント情報管理",
          variant: "warning",
          levels: [10, 9],
          show_menu: false,
          child_homes: [
            {
              header: "イベント情報一覧",
              variant: "dark",
              link: { name: "list_event" },
              levels: [10, 9],
              show_menu: false,
              icon: "calendar-alt"
            },
            {
              header: "イベント情報の新規追加",
              variant: "dark",
              link: { name: "add_event" },
              levels: [10, 9],
              show_menu: false,
              icon: "plus-square"
            }
          ]
        },
        {
          header: "クーポン　管理",
          variant: "primary",
          levels: [10, 9, 7],
          show_menu: false,
          child_homes: [
            {
              header: "クーポンリスト",
              variant: "dark",
              link: { name: "coupon" },
              levels: [10, 9, 7],
              show_menu: false,
              icon: "file-alt"
            },
            {
              header: "クーポンの新規追加",
              variant: "dark",
              link: { name: "add_coupon" },
              levels: [10, 9, 7],
              show_menu: false,
              icon: "plus-square"
            }
          ]
        }
      ],
      userLevel: ""
    };
  },
  created() {
    // getters.getUserLevelを監視
    // ユーザーレベルが取れ次第変更がかかる。
    (this.userLevel = this.$store.getters.getUserLevel),
      this.$store.watch(
        (state, getters) => getters.getUserLevel,
        (newValue, oldValue) => {
          if (newValue) {
            this.initMenus();
          }
        }
      );
    this.initMenus();
  },
  methods: {
    initMenus() {
      // 初期化
      this.setMenus();
    },
    setMenus() {
      this.menus.forEach(menu => {
        menu.child_homes.forEach(child_homes => {
          child_homes.show_menu = child_homes.levels.includes(this.userLevel);
        });
        menu.show_menu = menu.levels.includes(this.userLevel);
      });
    }
  }
};
</script>
<style scoped>
.title-cs {
  margin-bottom: 20px;
}
.title-icon {
  margin-right: 10px;
}
.content-icon {
  font-size: 6rem;
}
.hr {
  margin-left: 1rem;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 1rem;
  border: 0;
  border-top: 1px solid #eee;
}
.mw-20rem {
  max-width: 20rem;
}
</style>
