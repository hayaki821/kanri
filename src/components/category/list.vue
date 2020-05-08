<template>
  <b-container>
    <b-button variant="primary" class="mb-3" :to="{ name: 'add_category' }">
      新規追加
    </b-button>
    <b-table
      striped
      hover
      :items="items"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template v-slot:cell(id)="data">
        <router-link
          :to="{ name: 'edit_category', params: { id: data.item.id } }"
        >
          {{ data.item.id }}
        </router-link>
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
  </b-container>
</template>
<script>
export default {
  name: "ListCategory",
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
      items: [],
      fields: [
        { key: "id", label: "ID", sortable: true, sortable: true },
        { key: "label", label: "ラベル", sortable: true },
        {
          key: "group",
          label: "グループ",
          formatter: (value, key, item) => {
            const category_group = {
              1: "地点共通分類",
              2: "観光施設分類",
              3: "店舗ジャンル分類",
              4: "作品分類",
              5: "エリア",
              6: "モデルコース分類",
              7: "特集分類",
              8: "支払い方法"
            };
            return category_group[value];
          },
          sortable: true
        },
        {
          key: "dsipaly",
          label: "表示フラグ",
          sortable: true,
          formatter: (value, key, item) => {
            return value == 1 ? "表示する" : "表示しない";
          }
        },
        { key: "order", label: "並び順", sortable: true }
      ]
    };
  },
  computed: {
    rows() {
      return this.items.length;
    }
  },
  mounted() {
    this.loadList();
    this.$emit("title", this.title);
  },
  methods: {
    loadList() {
      this.is_loading(true);
      this.get_axios("api/admin_manager/category")
        .then(res => {
          this.items = res.data;
          console.log(this.items);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => this.is_loading(false));
    },
    hidecategory(id) {
      console.log(id);
      if (confirm("非表示にします。よろしいですか？")) {
        this.delete_axios("api/admin_manager/category/" + id).then(res => {
          console.log(res);
          this.loadList();
        });
      }
    }
  }
};
</script>
