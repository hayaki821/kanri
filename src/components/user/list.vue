<template>
  <b-container>
    <b-button
      v-if="ownlevel > 8"
      variant="primary"
      class="mb-3"
      :to="{ name: 'add_user' }"
    >
      新規追加
    </b-button>
    <b-table striped hover :items="items" :fields="fields">
      <template v-slot:cell(id)="data">
        <router-link :to="{ name: 'edit_user', params: { id: data.item.id } }">
          {{ data.item.id }}
        </router-link>
      </template>
      <template v-slot:cell(name)="data">
        <router-link :to="{ name: 'edit_user', params: { id: data.item.id } }">
          {{ data.item.name }}
        </router-link>
      </template>
    </b-table>
  </b-container>
</template>
<script>
export default {
  name: "Listuser",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data: () => {
    return {
      items: [],
      levels: {},
      ownlevel: null,
      fields: [
        { key: "id", label: "ID", sortable: true },
        { key: "email", label: "Eメール", sortable: true },
        { key: "name", label: "名前", sortable: true },
        {
          key: "level",
          label: "権限レベル",
          sortable: true,
          formatter: "level_label"
        },
        { key: "created_at", label: "作成日", sortable: true },
        { key: "updated_at", label: "編集日", sortable: true },
        { key: "deleted_at", label: "削除日", sortable: true }
      ]
    };
  },
  mounted() {
    this.loadList();
    this.$emit("title", this.title);
    this.ownlevel = this.$store.getters.getUserLevel;
  },
  methods: {
    loadList() {
      this.is_loading(true);
      this.get_axios("api/admin_manager/user")
        .then(res => {
          this.items = res.data;
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => this.is_loading(false));
    },
    hideuser(id) {
      console.log(id);
      if (confirm("非表示にします。よろしいですか？")) {
        this.delete_axios("api/admin_manager/user/" + id).then(res => {
          console.log(res);
          this.loadList();
        });
      }
    },
    level_label(v) {
      const levels = this.$store.getters.getUserLevels;
      return levels[v] || v;
    }
  }
};
</script>
