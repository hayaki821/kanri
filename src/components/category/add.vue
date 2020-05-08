<template>
  <b-container>
    <b-form-group v-if="id" id="input_id" label="ID" label-cols="3">
      <b-form-input v-model="id" disabled />
    </b-form-group>
    <form-helper
      :form-data="input_data"
      :fields-data="fields_data"
      :parent-id="id"
      :edit-mode="Boolean(id)"
      :posttype="posttype"
      @editOnSave="editOnSave"
      @save="save"
    ></form-helper>
  </b-container>
</template>
<script>
import formHelper from "@/components/formHelper/formHelper";

const initialData = {
  label: null,
  group: null,
  display: null,
  cnt: null
};
export default {
  name: "CategoryAdd",
  components: { formHelper },
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
  data() {
    return {
      posttype: "category",
      input_data: Object.assign({}, initialData),
      fields_data: [
        { key: "label", name: "ラベル", type: "string" },
        {
          key: "group",
          name: "グループ",
          type: "select",
          options: [
            { value: 1, text: "地点共通分類" },
            { value: 2, text: "観光施設分類" },
            { value: 3, text: "店舗ジャンル分類" },
            { value: 4, text: "作品分類" },
            { value: 5, text: "エリア" },
            { value: 6, text: "モデルコース分類" },
            { value: 7, text: "特集分類" },
            { value: 8, text: "支払い方法" }
          ]
        },
        {
          key: "display",
          name: "表示フラグ",
          type: "radio",
          options: [
            { value: 1, text: "表示する" },
            { value: 0, text: "表示しない" }
          ],
          editCallBack: v => {
            this.editOnSave({ key: "display", data: v.event });
          }
        },
        { key: "order", name: "並び順", type: "number" }
      ]
    };
  },
  watch: {
    id: {
      handler(newVal) {
        this.onLoad(newVal);
      },
      immediate: true
    }
  },
  mounted() {
    this.$emit("title", this.title);
  },
  methods: {
    onLoad(id) {
      if (!(Number(id) > 0)) {
        const group_list = this.fields_data.filter(elem => {
          return elem.key === "group";
        })[0];
        const group = group_list.options[0].value;
        const initialGroup = { group: group };
        this.input_data = Object.assign({}, initialData, initialGroup);
        return;
      }
      const postUrl = "api/admin_manager/category/";
      this.get_axios(postUrl + this.id).then(res => {
        this.input_data = Object.assign({}, res.data);
      });
    },
    save(v) {
      const postUrl = "api/admin_manager/category";
      const category = Object.assign({}, this.input_data, v);
      const formdata = category;
      console.log(category);
      this.post_axios(postUrl, formdata)
        .then(res => {
          console.log(res);
          this.$router.push({ name: "list_category" });
        })
        .catch(err => {
          const res = this.fields_data.map(elem => {
            if (Object.keys(err.data.errors).includes(elem.key)) {
              elem.invalid.state = false;
            }
            return elem;
          });
          this.fields_data = Object.assign([], res);
        });
    },
    editOnSave(e) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/category/" + this.id;
        const data = {};
        data[e.key] = e.data;
        const category = Object.assign({}, this.input_data, data);
        const formdata = category;
        this.put_axios(apiUrl, formdata).then(res => {
          console.log(res);
          this.onLoad(this.id);
        });
      }
    }
  }
};
</script>
<style scoped></style>
