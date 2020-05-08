<template>
  <b-container>
    <b-button variant="primary" class="mb-3" :to="{ name: 'add_tag' }">新規追加</b-button>
    <div>
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
            v-if="!notChange()"
            :to="{ name: 'edit_tag', params: { id: data.item.id } }"
          >{{ data.item.id }}</router-link>
          <div v-if="notChange()">{{ data.item.id }}</div>
        </template>
        <template v-slot:cell(display)="row">
          <b-form-radio-group v-model="row.value">
            <b-form-radio
              value="1"
              name="display"
              :disabled="notChange()"
              @change="changeDisplay(1,row.item.id)"
            >表示する</b-form-radio>
            <b-form-radio
              value="0"
              name="display"
              :disabled="notChange()"
              @change="changeDisplay(0,row.item.id)"
            >表示しない</b-form-radio>
          </b-form-radio-group>
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
const initialData = {
  label: null,
  display: null,
  order: null,
  cnt: null
};

export default {
  name: "ListTag",
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
        { key: "id", label: "ID", sortable: true, sortable: true },
        { key: "label", label: "ラベル", sortable: true },
        { key: "cnt", label: "登録数", sortable: true },
        { key: "display", label: "検索の表示", sortable: true },
        { key: "order", label: "並び順", sortable: true }
      ],
      items: [], //表示用
      input_data: Object.assign({}, initialData)
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
      this.get_axios("api/admin_manager/tag")
        .then(res => {
          this.items = res.data;
          this.items.forEach(item => {
            if (item["display"] !== 1) {
              item["display"] = 0;
            }
          });
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => this.is_loading(false));
    },
    changeDisplay(value, id) {
      const apiUrl = "/api/admin_manager/tag/" + id;
      const data = {
        display: value
      };
      const selectitems = this.items.find(v => v.id === id);
      const tag = Object.assign({}, selectitems, data);
      delete tag.id;
      const formdata = tag;
      this.put_axios(apiUrl, formdata).then(res => {
        console.log(selectitems);
      });
    },
    notChange() {
      const userLevel = this.$store.getters.getUserLevel;
      if (!(userLevel == 9 || userLevel == 10)) return true;
    }
  }
};
</script>
