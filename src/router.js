import Vue from "vue";
import Router from "vue-router";

const Login = () => import("@/components/login.vue");
const container = () => import("@/views/container.vue");

const adminHome = () => import("@/components/home");

const add_tag = () => import("@/components/tag/add.vue");
const list_tag = () => import("@/components/tag/list.vue");
const common = () => import("@/views/common.vue");
const add_user = () => import("@/components/user/add.vue");
const list_user = () => import("@/components/user/list.vue");
const add_category = () => import("@/components/category/add.vue");
const list_category = () => import("@/components/category/list.vue");
const add_spot = () => import("@/components/spot/add.vue");
const list_spot = () => import("@/components/spot/list.vue");
const add_course = () => import("@/components/course/add.vue");
const list_course = () => import("@/components/course/list.vue");
const add_topic = () => import("@/components/topic/add.vue");
const list_topic = () => import("@/components/topic/list.vue");
const add_event = () => import("@/components/event/add.vue");
const list_event = () => import("@/components/event/list.vue");
const add_news = () => import("@/components/news/add.vue");
const list_news = () => import("@/components/news/list.vue");
const add_spotInformation = () =>
  import("@/components/spotInformation/add.vue");
const list_spotInformation = () =>
  import("@/components/spotInformation/list.vue");
const add_coupon = () => import("@/components/coupon/add.vue");
const list_coupon = () => import("@/components/coupon/list.vue");
//import userList from '@/admin/src/components/user/user_list'

Vue.use(Router);

export default new Router({
  // mode: "history",
  mode: "hash", // https://router.vuejs.org/api/#mode
  linkActiveClass: "open active",
  scrollBehavior: () => ({ y: 0 }),
  base: "/",
  routes: [
    // {
    //   path: "/Login",
    //   name: "ログイン",
    //   component: Login,
    // },
    {
      path: "/",
      component: container,
      redirect: "/home",
      children: [
        {
          path: "home",
          name: "adminHome",
          meta: { title: "スケジュール" },
          component: adminHome,
        },
        {
          path: "category",
          name: "category",
          component: common,
          redirect: "/category/list",
          props: () => ({
            icon: "file-alt",
          }),
          children: [
            {
              path: "list",
              name: "list_category",
              component: list_category,
              props: { title: "カテゴリーのリスト" },
            },
            {
              path: "add",
              name: "add_category",
              component: add_category,
              props: {
                title: "カテゴリーの新規追加",
              },
            },
            {
              path: "edit/:id",
              name: "edit_category",
              component: add_category,
              props: (route) => ({
                id: Number(route.params.id),
                title: "カテゴリーの編集",
              }),
            },
          ],
        },
        {
          path: "tag",
          name: "tag",
          component: common,
          redirect: "/tag/list",
          props: () => ({
            icon: "tags",
          }),
          children: [
            {
              path: "list",
              name: "list_tag",
              component: list_tag,
              props: { title: "タグ一覧" },
            },
            {
              path: "add",
              name: "add_tag",
              component: add_tag,
              props: {
                title: "タグの新規追加",
              },
            },
            {
              path: "edit/:id",
              name: "edit_tag",
              component: add_tag,
              props: (route) => ({
                id: Number(route.params.id),
                title: "タグの編集",
              }),
            },
          ],
        },
        {
          path: "user",
          name: "user",
          component: common,
          redirect: "/user/list",
          props: () => ({
            icon: "user",
          }),
          children: [
            {
              path: "list",
              name: "list_user",
              component: list_user,
              props: { title: "ユーザーのリスト" },
            },
            {
              path: "add",
              name: "add_user",
              component: add_user,
              props: {
                title: "ユーザーの新規追加",
              },
            },
            {
              path: "edit/:id",
              name: "edit_user",
              component: add_user,
              props: (route) => ({
                id: Number(route.params.id),
                title: "ユーザーの編集",
              }),
            },
          ],
        },
        {
          path: "spot",
          name: "spot",
          component: common,
          redirect: "/spot/list",
          props: () => ({
            icon: "map-marked-alt",
          }),
          children: [
            {
              path: "list",
              name: "list_spot",
              component: list_spot,
              props: { title: "スポットのリスト" },
            },
            {
              path: "add",
              name: "add_spot",
              component: add_spot,
              props: {
                title: "スポットの新規追加",
              },
            },
            {
              path: "edit/:id",
              name: "edit_spot",
              component: add_spot,
              props: (route) => ({
                id: Number(route.params.id),
                title: "スポットの編集",
              }),
            },
          ],
        },
        {
          path: "course",
          name: "course",
          component: common,
          redirect: "/course/list",
          props: () => ({
            icon: "road",
          }),
          children: [
            {
              path: "list",
              name: "list_course",
              component: list_course,
              props: { title: "コースのリスト" },
            },
            {
              path: "add",
              name: "add_course",
              component: add_course,
              props: {
                title: "コースの新規追加",
              },
            },
            {
              path: "edit/:id",
              name: "edit_course",
              component: add_course,
              props: (route) => ({
                id: Number(route.params.id),
                title: "コースの編集",
              }),
            },
          ],
        },
        {
          path: "topic",
          name: "topic",
          component: common,
          redirect: "/topic/list",
          props: () => ({
            icon: "file-alt",
          }),
          children: [
            {
              path: "list",
              name: "list_topic",
              component: list_topic,
              props: { title: "特集のリスト" },
            },
            {
              path: "add",
              name: "add_topic",
              component: add_topic,
              props: {
                title: "特集の新規追加",
              },
            },
            {
              path: "edit/:id",
              name: "edit_topic",
              component: add_topic,
              props: (route) => ({
                id: Number(route.params.id),
                title: "特集の編集",
              }),
            },
          ],
        },
        {
          path: "news",
          name: "news",
          component: common,
          redirect: "/news/list",
          props: () => ({
            icon: "newspaper",
          }),
          children: [
            {
              path: "list",
              name: "list_news",
              component: list_news,
              props: { title: "お知らせのリスト" },
            },
            {
              path: "add",
              name: "add_news",
              component: add_news,
              props: {
                title: "お知らせの新規追加",
              },
            },
            {
              path: "edit/:id",
              name: "edit_news",
              component: add_news,
              props: (route) => ({
                id: Number(route.params.id),
                title: "お知らせの編集",
              }),
            },
          ],
        },
        {
          path: "event",
          name: "event",
          component: common,
          redirect: "/event/list",
          props: () => ({
            icon: "calendar-alt",
          }),
          children: [
            {
              path: "list",
              name: "list_event",
              component: list_event,
              props: { title: "イベントのリスト" },
            },
            {
              path: "add",
              name: "add_event",
              component: add_event,
              props: {
                title: "イベントの新規追加",
              },
            },
            {
              path: "edit/:id",
              name: "edit_event",
              component: add_event,
              props: (route) => ({
                id: Number(route.params.id),
                title: "イベントの編集",
              }),
            },
          ],
        },
        {
          path: "spot-information",
          name: "SpotInformation",
          component: common,
          redirect: "/spot-information/list",
          props: () => ({
            icon: "map-marked-alt",
          }),
          children: [
            {
              path: "list/:id",
              name: "list_SpotInformation",
              component: list_spotInformation,
              props: (route) => ({
                id: Number(route.params.id),
                title: "お知らせのリスト",
              }),
            },
            {
              path: "add",
              name: "add_SpotInformation",
              component: add_spotInformation,
              props: {
                title: "スポットお知らせの新規追加",
              },
            },
            {
              path: "edit/:spot_id/:id",
              name: "edit_SpotInformation",
              component: add_spotInformation,
              props: (route) => ({
                id: Number(route.params.id),
                spotId: Number(route.params.spot_id),
                title: "スポットお知らせの編集",
              }),
            },
          ],
        },
        {
          path: "coupon",
          name: "coupon",
          component: common,
          redirect: "/coupon/list",
          props: () => ({
            icon: "digital-tachograph",
          }),
          children: [
            {
              path: "list",
              name: "list_coupon",
              component: list_coupon,
              props: { title: "クーポンのリスト" },
            },
            {
              path: "add",
              name: "add_coupon",
              component: add_coupon,
              props: {
                title: "クーポンの新規追加",
              },
            },
            {
              path: "edit/:id",
              name: "edit_coupon",
              component: add_coupon,
              props: (route) => ({
                id: Number(route.params.id),
                title: "クーポンの編集",
              }),
            },
          ],
        },
      ],
    },
  ],
});
