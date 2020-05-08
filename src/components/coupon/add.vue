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
  spot_id: 1,
  content: "",
  limit: "",
  count: "",
  onetime: "",
  coupon_open_at: "",
  coupon_close_at: ""
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
      posttype: "coupon",
      input_data: Object.assign({}, initialData),
      fields_data: [
        {
          key: "spot_id",
          name: "対象スポット",
          type: "select",
          options: [],
          required: true,
          disabled: this.disableSpotID()
        },
        {
          key: "content",
          name: "テキスト",
          type: "string",
          length: null,
          required: true
        },
        {
          key: "limit",
          name: "上限",
          type: "number",
          length: null
        },
        {
          key: "count",
          name: "残数",
          type: "number",
          length: null
        },
        {
          key: "onetime",
          name: "ワンタイムフラグ",
          type: "radio",
          options: [
            { value: 1, text: "一度切り" },
            { value: 0, text: "何度でも" }
          ],
          editCallBack: v => {
            console.log(v);
            this.editOnSave({ key: "onetime", data: v.event });
          }
        },
        { key: "coupon_open_at", name: "クーポン開始日", type: "date" },
        { key: "coupon_close_at", name: "クーポン終了日", type: "date" }
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
    this.initOptions();
  },
  methods: {
    initOptions() {
      const apiUrl = "/api/admin_manager/spot/";
      this.get_axios(apiUrl).then(res => {
        const options = res.data.map(elem => {
          return { value: elem.id, text: elem.spot_name };
        });
        this.fields_data.map(elem => {
          if (elem.key === "spot_id") {
            elem.options = options;
          }
        });
      });
    },
    disableSpotID() {
      if (this.$route.query.spot_id > 0) {
        this.$nextTick(() => {
          this.input_data.spot_id = Number(this.$route.query.spot_id);
        });
        return true;
      }
      return Boolean(this.spotId > 0);
    },
    onLoad(id) {
      if (!(Number(id) > 0)) {
        this.input_data = Object.assign({}, initialData);
        return;
      }
      const postUrl = "api/admin_manager/coupon/";
      this.get_axios(postUrl + this.id).then(res => {
        const data = res.data;
        this.input_data = Object.assign({}, res.data);
      });
    },
    save(v) {
      const postUrl = "api/admin_manager/coupon";
      const coupon = Object.assign({}, this.input_data, v);
      const formdata = coupon;
      console.log(formdata);
      this.post_axios(postUrl, formdata).then(res => {
        this.$router.push({ name: "list_coupon" });
      });
    },
    editOnSave(e) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/coupon/" + this.id;
        const data = {};
        data[e.key] = e.data;
        const coupon = Object.assign({}, this.input_data, data);
        const formdata = coupon;
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
