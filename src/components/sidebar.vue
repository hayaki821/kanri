<template>
  <b-sidebar
    id="sidebar-toggler"
    v-model="showMenu"
    width="250px"
    top="15px"
    no-header
    no-close-on-route-change
    z-index="5"
  >
    <template v-slot:default="{}">
      <div id="sidebar">
        <nav class="nav flex-column">
          <side-menu :menu-data="menus" />
        </nav>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import sideMenu from "@/components/sidebar/sideMenu";

export default {
  components: {
    sideMenu
  },
  data: () => {
    return {
      showMenu: true,
      menus: [
        {
          title: "各種カテゴリの管理",
          icon: "folder-open",
          hide: true, //childlistの開けしめよう
          levels: [9, 10],
          show_menu: false,
          links: [
            {
              title: "カテゴリ一覧",
              link: { name: "list_category" },
              levels: [10, 9, 7, 5],
              show_menu: false
            },
            {
              title: "カテゴリの新規追加",
              link: { name: "add_category" },
              levels: [10, 9, 7, 5],
              show_menu: false
            }
          ]
        },
        {
          title: "タグの管理",
          icon: "tags",
          hide: true,
          levels: [5, 7, 9, 10],
          show_menu: false,
          links: [
            {
              title: "タグ一覧",
              link: { name: "list_tag" },
              levels: [10, 9, 7, 5],
              show_menu: false
            },
            {
              title: "タグの新規追加",
              link: { name: "add_tag" },
              levels: [10, 9, 7, 5],
              show_menu: false
            }
          ]
        },
        {
          title: "ユーザ管理",
          icon: "user",
          hide: true, //childlistの開けしめよう
          levels: [5, 7, 9, 10],
          show_menu: false,
          links: [
            {
              title: "ユーザリスト",
              link: { name: "list_user" },
              levels: [10, 9, 7, 5],
              show_menu: false
            },
            {
              title: "ユーザの新規追加",
              link: { name: "add_user" },
              levels: [10, 9],
              show_menu: false
            }
          ]
        },
        {
          title: "スポット管理",
          icon: "map-marked-alt",
          hide: true, //childlistの開けしめよう
          levels: [7, 9, 10],
          show_menu: false,
          links: [
            {
              title: "スポットのリスト",
              link: { name: "list_spot" },
              levels: [10, 9, 7],
              show_menu: false
            },
            {
              title: "スポットの新規追加",
              link: { name: "add_spot" },
              levels: [10, 9, 7],
              show_menu: false
            },
            {
              title: "お知らせの新規追加",
              link: { name: "add_SpotInformation" },
              levels: [10, 9, 7],
              show_menu: false
            }
          ]
        },
        {
          title: "モデルコース管理",
          icon: "road",
          hide: true, //childlistの開けしめよう
          levels: [5, 9, 10],
          show_menu: false,
          links: [
            {
              title: "モデルコースのリスト",
              link: { name: "list_course" },
              levels: [10, 9, 5],
              show_menu: false
            },
            {
              title: "モデルコースの新規追加",
              link: { name: "add_course" },
              levels: [10, 9, 5],
              show_menu: false
            }
          ]
        },
        {
          title: "特集記事管理",
          icon: "file-alt",
          hide: true, //childlistの開けしめよう
          levels: [5, 9, 10],
          show_menu: false,
          links: [
            {
              title: "特集記事リスト",
              link: { name: "list_topic" },
              levels: [10, 9, 5],
              show_menu: false
            },
            {
              title: "特集記事の新規追加",
              link: { name: "add_topic" },
              levels: [10, 9, 5],
              show_menu: false
            }
          ]
        },
        // {
        //   title: "スタンプラリー管理",
        //   icon: "stamp",
        //   hide: true, //childlistの開けしめよう
        //   levels: [5, 7, 9, 10],
        //   show_menu: false,
        //   links: [
        //     {
        //       title: "スタンプラリー一覧",
        //       link: "/",
        //       levels: [10, 9, 5],
        //       show_menu: false
        //     },
        //     {
        //       title: "スタンプラリーの新規追加",
        //       link: "/",
        //       levels: [10, 9, 5],
        //       show_menu: false
        //     },
        //     {
        //       title: "スタンプラリーの特集情報",
        //       link: "/",
        //       levels: [10, 9, 5],
        //       show_menu: false
        //     }
        //   ]
        // },
        {
          title: "お知らせ管理",
          icon: "newspaper",
          hide: true, //childlistの開けしめよう
          levels: [9, 10],
          show_menu: false,
          links: [
            {
              title: "お知らせ一覧",
              link: { name: "list_news" },
              levels: [10, 9],
              show_menu: false
            },
            {
              title: "お知らせの新規追加",
              link: { name: "add_news" },
              levels: [10, 9],
              show_menu: false
            }
          ]
        },
        {
          title: "イベント情報管理",
          icon: "calendar-alt",
          hide: true, //childlistの開けしめよう
          levels: [9, 10],
          show_menu: false,
          links: [
            {
              title: "イベント情報一覧",
              link: { name: "list_event" },
              levels: [10, 9],
              show_menu: false
            },
            {
              title: "イベント情報の新規追加",
              link: { name: "add_event" },
              levels: [10, 9],
              show_menu: false
            }
          ]
        },
        {
          title: "クーポン管理",
          icon: "digital-tachograph",
          hide: true, //childlistの開けしめよう
          levels: [7, 9, 10],
          show_menu: false,
          links: [
            {
              title: "クーポン一覧",
              link: { name: "list_coupon" },
              levels: [10, 9, 7],
              show_menu: false
            },
            {
              title: "クーポンの新規追加",
              link: { name: "add_coupon" },
              levels: [10, 9, 7],
              show_menu: false
            }
          ]
        }
        // {
        //   title: "プッシュ通知管理",
        //   icon: "bell",
        //   hide: true, //childlistの開けしめよ
        //   levels: [9, 10],
        //   show_menu: false,
        //   links: [
        //     {
        //       title: "プッシュ通知の新規追加",
        //       link: "/",
        //       levels: [10, 9, 5],
        //       show_menu: false
        //     },
        //     {
        //       title: "クーポンの新規追加",
        //       link: "/",
        //       levels: [10, 9, 5],
        //       show_menu: false
        //     },
        //     {
        //       title: "クーポンの利用履歴",
        //       link: "/",
        //       levels: [10, 9, 5],
        //       show_menu: false
        //     }
        //   ]
        // }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
#sidebar-toggler {
  background: #333;
  height: auto !important;
  position: relative !important;
  @media (max-width: 599.8px) {
    position: absolute !important;
  }
}

@media (min-width: 600px) {
  #sidebar {
    width: 250px;
    height: 100%;
    background: #333;
    min-height: calc(100vh - 68px);
  }
  #sidebar.slide {
    position: absolute !important;
    top: 80px;
  }
}
.nav {
  position: sticky;
  top: 0;
}
</style>
