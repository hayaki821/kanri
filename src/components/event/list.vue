<template>
  <b-container>
    <b-button variant="primary" class="mb-3" :to="{ name: 'add_event' }">新規追加</b-button>
    <b-row>
      <b-col v-for="(item, index) in items" :key="index" sm="4" class="mb-2">
        <b-card
          :title="item.event_name"
          :img-src="item.thumbnail_main_image_url"
          img-alt="item.event_name"
          img-top
          tag="article"
          style="max-width: 20rem;"
          :class="'h-100' + (item.deleted_at ? 'deleted' : '')"
        >
          <b-card-text>
            {{ item.title }}
            <br />
            {{ formatDate(item.public_start_at) }} -
            {{ formatDate(item.public_end_at) }}
            <br />
            {{ formatDate(item.event_start_at) }} -
            {{ formatDate(item.event_end_at) }}
            <br />
          </b-card-text>
          <template v-slot:footer>
            <b-row>
              <b-col>
                <b-button
                  :to="{ name: 'edit_event', params: { id: item.id } }"
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
                  @click="hideEvent(item.id)"
                >
                  <font-awesome-icon icon="trash-alt" />非表示
                </b-button>
                <b-button v-else href="#" variant="secondary" sm @click="showEvent(item.id)">
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
import moment from "moment";
export default {
  name: "ListEvent",
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
    formatDate(date) {
      return moment(date).format("YYYY/MM/DD");
    },
    loadList() {
      this.is_loading(true);
      this.get_axios("api/admin_manager/event")
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
        this.delete_axios("api/admin_manager/event/" + id).then(res => {
          console.log(res);
          this.loadList();
        });
      }
    },
    showEvent(id) {
      if (confirm("再表示します。よろしいですか？")) {
        this.put_axios("api/admin_manager/event/" + id + "/restore")
          .then(res => {
            this.loadList();
          })
          .finally(() => this.is_loading(false));
      }
    }
  }
};
</script>
