<template>
  <b-container>
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
  label: "",
  display: "",
  order: "",
  cnt: ""
};
export default {
  name: "Add",
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
      posttype: "tag",
      input_data: Object.assign({}, initialData),
      fields_data: [
        {
          key: "label",
          name: "ラベル",
          type: "string",
          length: 255,
          required: true
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
            console.log(v);
            this.editOnSave({ key: "display", data: v.event });
          }
        },
        {
          key: "order",
          name: "並び順",
          type: "number"
        },
        {
          key: "cnt",
          name: "登録",
          type: "number"
        }
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
        this.input_data = Object.assign({}, initialData);
        return;
      }
      const postUrl = "api/admin_manager/tag/";
      this.get_axios(postUrl + this.id).then(res => {
        this.input_data = Object.assign({}, res.data);
      });
    },
    save(v) {
      const postUrl = "api/admin_manager/tag";
      const tag = Object.assign({}, this.input_data, v);
      const formdata = tag;
      this.post_axios(postUrl, formdata)
        .then(res => {
          console.log(res);
          this.$router.push({ name: "list_tag" });
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
        const apiUrl = "/api/admin_manager/tag/" + this.id;
        const data = {};
        data[e.key] = e.data;
        const tag = Object.assign({}, this.input_data, data);
        const formdata = tag;
        this.put_axios(apiUrl, formdata).then(res => {
          // console.log(res);
          this.onLoad(this.id);
        });
      }
    }
  }
};
</script>