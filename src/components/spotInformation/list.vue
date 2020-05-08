<template>
  <b-container>
    <b-button
      variant="primary"
      class="mb-3"
      :to="{ name: 'add_SpotInformation', query: { spotId: id } }"
    >
      新規追加
    </b-button>
    <div v-if="!Object.keys(items).length">
      データがありません。
    </div>
    <b-row>
      <b-col v-for="(item, index) in items" :key="index" sm="4" class="mb-2">
        <b-card
          :title="item.information_name"
          :img-src="item.thumbnail_main_image_url"
          img-alt="item.information_name"
          img-top
          tag="article"
          style="max-width: 20rem;"
          :class="'h-100' + (item.deleted_at ? 'deleted' : '')"
        >
          <b-card-text>{{ item.information_title }}</b-card-text>
          <template v-slot:footer>
            <b-row>
              <b-col>
                <b-button
                  :to="{
                    name: 'edit_SpotInformation',
                    params: { id: item.id, spot_id: id }
                  }"
                  href="#"
                  variant="warning"
                  sm
                >
                  <font-awesome-icon icon="pen-alt" />編集
                </b-button>
              </b-col>
              <b-col>
                <b-button
                  v-if="!item.deleted_at"
                  href="#"
                  variant="danger"
                  sm
                  @click="hideinformation(item.id)"
                >
                  <font-awesome-icon icon="trash-alt" />非表示
                </b-button>
                <b-button
                  v-else
                  href="#"
                  variant="secondary"
                  sm
                  @click="hideinformation(item.id)"
                >
                  <font-awesome-icon icon="trash-alt" />再表示
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
  name: "SpotInfoList",
  props: {
    id: {
      type: Number,
      default: 0
    },
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
      this.get_axios("api/admin_manager/spot/" + this.id + "/spot_information")
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
    hideEvent(id) {
      console.log(id);
      if (confirm("非表示にします。よろしいですか？")) {
        this.delete_axios("api/admin_manager/information/" + id).then(res => {
          console.log(res);
          this.loadList();
        });
      }
    }
  }
};
</script>
