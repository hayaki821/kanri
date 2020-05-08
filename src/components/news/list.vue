<template>
  <b-container>
    <b-button variant="primary" class="mb-3" :to="{ name: 'add_news' }">新規追加</b-button>
    <b-row>
      <b-col v-for="(item, index) in items" :key="index" sm="4" class="mb-2">
        <b-card
          :title="item.title"
          :img-src="item.thumbnail_main_image_url"
          img-alt="item.title"
          img-top
          tag="article"
          style="max-width: 20rem;"
          :class="'h-100' + item.deleted_at ? 'deleted' : ''"
        >
          <b-card-text>{{ item.title }}</b-card-text>
          <template v-slot:footer>
            <b-row>
              <b-col>
                <b-button
                  :to="{ name: 'edit_news', params: { id: item.id } }"
                  href="#"
                  variant="warning"
                  sm
                >
                  <font-awesome-icon icon="pen-alt" />編集
                </b-button>
                <b-button
                  v-if="!item.deleted_at"
                  sm
                  href="#"
                  variant="danger"
                  @click="hideNews(item.id)"
                >
                  <font-awesome-icon icon="trash-alt" />削除
                </b-button>
              </b-col>
            </b-row>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "ListNews",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data: () => {
    return {
      items: {}
    };
  },
  mounted() {
    this.loadList();
    this.$emit("title", this.title);
  },
  methods: {
    loadList() {
      this.is_loading(true);
      this.get_axios("api/admin_manager/news")
        .then(res => {
          const data = {};
          res.data.forEach(element => {
            data[element.id] = element;
          });
          this.items = Object.assign({}, data);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => this.is_loading(false));
    },
    hideNews(id) {
      console.log(id);
      if (confirm("非表示にします。よろしいですか？")) {
        this.delete_axios("api/admin_manager/news/" + id).then(res => {
          console.log(res);
          this.loadList();
        });
      }
    }
  }
};
</script>