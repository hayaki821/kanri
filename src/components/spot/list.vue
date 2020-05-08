<template>
  <b-container>
    <b-button variant="primary" class="mb-3" :to="{ name: 'add_spot' }">新規追加</b-button>
    <b-row>
      <b-col v-for="(item, index) in items" :key="index" sm="4" class="mb-2">
        <b-card
          :title="item.spot_name"
          :img-src="item.thumbnail_main_image_url"
          img-alt="item.spot_name"
          img-top
          tag="article"
          style="max-width: 20rem;"
          :class="'h-100' + item.deleted_at ? 'deleted' : ''"
        >
          <b-card-text>
            {{ item.address }}
            <br />
            {{ item.spot_tel }}
          </b-card-text>
          <template v-slot:footer>
            <b-button-group size="sm">
              <b-row cols="1">
                <b-button
                  :to="{ name: 'list_SpotInformation', params: { id: item.id } }"
                  href="#"
                  variant="info"
                  class="my-1"
                >
                  <font-awesome-icon icon="newspaper" />お知らせ
                </b-button>
                <b-button
                  :to="{ name: 'list_coupon', query: { spot_id: item.id } }"
                  href="#"
                  variant="success"
                  class="my-1"
                >
                  <font-awesome-icon icon="digital-tachograph" />クーポン
                </b-button>
                <b-button
                  :to="{ name: 'edit_spot', params: { id: item.id } }"
                  href="#"
                  variant="warning"
                  sm
                  class="my-1"
                >
                  <font-awesome-icon icon="pen-alt" />編集
                </b-button>
                <b-button
                  v-if="!item.deleted_at"
                  sm
                  href="#"
                  variant="danger"
                  class="my-1"
                  @click="hideSpot(item.id)"
                >
                  <font-awesome-icon icon="trash-alt" />非表示
                </b-button>
                <b-button v-else sm href="#" variant="secondary" @click="showSpot(item.id)">
                  <font-awesome-icon icon="trash-alt" />再表示
                </b-button>
              </b-row>
            </b-button-group>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "ListSpot",
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
    this.$emit("title", this.title);
    this.loadList();
  },
  methods: {
    loadList() {
      this.is_loading(true);
      this.get_axios("api/admin_manager/spot")
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
    hideSpot(id) {
      if (confirm("非表示にします。よろしいですか？")) {
        this.delete_axios("api/admin_manager/spot/" + id)
          .then(res => {
            this.loadList();
          })
          .finally(() => this.is_loading(false));
      }
    },
    showSpot(id) {
      if (confirm("再表示します。よろしいですか？")) {
        this.put_axios("api/admin_manager/spot/" + id + "/restore")
          .then(res => {
            this.loadList();
          })
          .finally(() => this.is_loading(false));
      }
    }
  }
};
</script>
