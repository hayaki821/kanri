<template>
  <b-container>
    <b-button
      v-if="!this.$route.query.spot_id"
      variant="primary"
      class="mb-3"
      :to="{ name: 'add_coupon' }"
    >新規追加</b-button>
    <b-button
      v-if="this.$route.query.spot_id"
      variant="primary"
      class="mb-3"
      :to="{ name: 'add_coupon' , query: { spot_id: this.$route.query.spot_id}}"
    >新規追加</b-button>
    <div v-if="!Object.keys(items).length">データがありません。</div>
    <div v-if="Object.keys(items).length">
      <b-table
        striped
        hover
        :items="items"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
      >
        {{ items.id }}
        <template v-slot:cell(id)="data">
          <router-link
            v-if="!notChange()"
            :to="{ name: 'edit_coupon', params: { id: data.item.id } }"
          >{{ data.item.id }}</router-link>
          <div v-if="notChange()">{{ data.item.id }}</div>
        </template>
        <template v-slot:cell(actions)="item">
          <b-button-group size="sm">
            <b-button
              v-if="!item.item.deleted_at"
              sm
              href="#"
              variant="danger"
              @click="hideCoupon(item.item.id)"
            >
              <font-awesome-icon icon="trash-alt" />非表示
            </b-button>
            <b-button v-else sm href="#" variant="secondary" @click="showCoupon(item.item.id)">
              <font-awesome-icon icon="trash-alt" />再表示
            </b-button>
          </b-button-group>
        </template>
      </b-table>
      <div class="d-flex align-center">
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
          class="m-auto"
        ></b-pagination>
      </div>
    </div>
  </b-container>
</template>
<script>
export default {
  name: "ListCoupon",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data: () => {
    return {
      perPage: 10,
      currentPage: 1,
      fields: [
        { key: "id", label: "ID", sortable: true },
        { key: "spot_id", label: "スポットID", sortable: true },
        { key: "spot_name", label: "スポット名", sortable: true },
        { key: "count", label: "残数", sortable: true },
        { key: "coupon_open_at", label: "クーポン開始日", sortable: true },
        { key: "coupon_close_at", label: "クーポン終了日", sortable: true },
        { key: "actions", label: "表示非表示", sortable: true }
      ],
      items: [] //表示用
    };
  },
  computed: {
    rows() {
      return this.items.length;
    }
  },
  watch: {
    $route(to, from) {
      this.loadList();
    }
  },
  mounted() {
    this.loadList();
    this.$emit("title", this.title);
  },
  methods: {
    loadList() {
      this.is_loading(true);
      let get_api = "";
      if (this.$route.query.spot_id) {
        get_api =
          "api/admin_manager/coupon?spot_id=" + this.$route.query.spot_id;
      } else {
        get_api = "api/admin_manager/coupon";
      }
      this.get_axios(get_api)
        .then(res => {
          this.items = res.data;
          this.items.forEach(item => {
            if (item["onetime"] !== 1) {
              item["onetime"] = 0;
            }
            item["count"] = item["count"] + "/" + item["limit"];
          });
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => this.is_loading(false));
    },
    notChange() {
      const userLevel = this.$store.getters.getUserLevel;
      if (!(userLevel == 7 || userLevel == 9 || userLevel == 10)) return true;
    },
    hideCoupon(id) {
      if (confirm("非表示にします。よろしいですか？")) {
        this.delete_axios("api/admin_manager/coupon/" + id)
          .then(res => {
            this.loadList();
          })
          .finally(() => this.is_loading(false));
      }
    },
    showCoupon(id) {
      if (confirm("再表示します。よろしいですか？")) {
        this.put_axios("api/admin_manager/coupon/" + id + "/restore")
          .then(res => {
            this.loadList();
          })
          .finally(() => this.is_loading(false));
      }
    }
  }
};
</script>
