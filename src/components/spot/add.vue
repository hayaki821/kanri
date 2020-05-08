<template>
  <b-container>
    <form-helper
      :form-data="input_data"
      :fields-data="fields_data"
      :parent-id="id"
      :post-image-url="postImageUrl"
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
  spot_name: "",
  latitude: "",
  longitude: "",
  address: "",
  spot_open: "",
  spot_close: "",
  spot_charge: "",
  access: "",
  spot_tel: "",
  spot_fax: "",
  inquiry: "",
  web_url: "",
  twitter_url: "",
  instagram_url: "",
  facebook_url: "",
  line_url: "",
  other_url: "",
  main_image_url: "",
  spot_content: "",
  spot_area_id: "",
  purpose_category_id: "",
  place_category_id: "",
  shop_category_id: "",
  input_tags: [],
  spot_owner_id: null,
  spot_area_id: null,
  purpose_category_id: null,
  place_category_id: null,
  shop_category_id: null,
  spot_works: null,
  spot_payment_ways: null,
  spot_topic_rels: null,
  spot_sub_images: []
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
      posttype: "spot",
      postImageUrl: "/api/admin_manager/spot/image_upload",
      input_data: Object.assign({}, initialData),
      fields_data: [
        {
          key: "spot_name",
          name: "地点名称",
          type: "string",
          length: 255,
          required: true
        },
        {
          key: "latitude",
          name: "位置情報（緯度）",
          type: "string",
          length: null,
          required: true
        },
        {
          key: "longitude",
          name: "位置情報（経度）",
          type: "string",
          length: null,
          required: true
        },
        {
          key: "map",
          name: "地図から選択",
          type: "map",
          length: null
        },
        {
          key: "address",
          name: "住所",
          type: "string",
          length: null,
          required: true
        },
        { key: "spot_open", name: "営業時間", type: "text", length: null },
        { key: "spot_close", name: "定休日", type: "text", length: null },
        { key: "spot_charge", name: "料金", type: "text", length: null },
        { key: "access", name: "アクセス方法", type: "text", length: null },
        { key: "spot_tel", name: "電話", type: "string", length: 20 },
        { key: "spot_fax", name: "FAX", type: "string", length: 20 },
        { key: "inquiry", name: "問い合わせ先", type: "text", length: null },
        { key: "web_url", name: "ウェブサイト", type: "string", length: 255 },
        { key: "twitter_url", name: "Twitter", type: "string", length: 255 },
        {
          key: "instagram_url",
          name: "instagram",
          type: "string",
          length: 255
        },
        { key: "facebook_url", name: "facebook", type: "string", length: 255 },
        { key: "line_url", name: "LINE@", type: "string", length: 255 },
        { key: "other_url", name: "その他URL", type: "string", length: 255 },
        {
          key: "main_image_input_path",
          name: "メイン写真",
          type: "file",
          origin: "preview_main_image_url",
          editMainImage: image_url => {
            this.editMainImages(image_url);
          }
        },
        {
          key: "spot_sub_images",
          name: "サブ写真",
          type: "images",
          caption: true,
          editSubImages: v => {
            this.editSubImages(v, "spot_sub_images");
          },
          deleteSubImage: v => {
            this.deleteSubImages(v, "spot_sub_images");
          }
        },
        { key: "spot_content", name: "説明文", type: "text" },
        {
          key: "spot_area_id",
          name: "エリア",
          type: "select",
          options: this.setOptions("spot_area_id")
        },
        {
          key: "purpose_category_id",
          name: "地点共通分類",
          type: "select",
          options: this.setOptions("purpose_category_id")
        },
        {
          key: "place_category_id",
          name: "観光施設分類",
          type: "select",
          options: this.setOptions("place_category_id")
        },
        {
          key: "shop_category_id",
          name: "店舗ジャンル分類",
          type: "select",
          options: this.setOptions("shop_category_id")
        },
        { key: "input_tags", name: "タグ", type: "tags", length: 512 },
        {
          key: "spot_owner_id",
          name: "スポットオーナー",
          type: "string",
          options: this.setOptions("spot_owner_id")
        },
        { key: "order", name: "並び順", type: "string", length: null },
        {
          key: "spot_payment_ways",
          name: "支払い方法",
          type: "checkbox",
          editCallBack: v => {
            this.checkbox_callback(v, "payment_way");
          },
          options: this.setOptions("spot_payment_ways")
        },
        {
          key: "spot_works",
          name: "作品分類",
          type: "checkbox",
          editCallBack: v => {
            this.checkbox_callback(v, "work");
          },
          options: this.setOptions("spot_works")
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

      const postUrl = "api/admin_manager/spot/";
      this.get_axios(postUrl + this.id).then(res => {
        const data = res.data;
        const toArray = {};
        if (data.spot_payment_ways && data.spot_payment_ways.length > 0) {
          toArray.spot_payment_ways = data.spot_payment_ways.map(elem => {
            return elem.payment_way_id;
          });
        }
        if (data.spot_works && data.spot_works.length > 0) {
          toArray.spot_works = data.spot_works.map(elem => {
            return elem.category_id;
          });
        }
        toArray.input_tags = data.tags.split(",");
        toArray.map_center = {
          lat: res.data.latitude,
          lng: res.data.longitude
        };
        this.input_data = Object.assign({}, res.data, toArray);
      });
    },
    save(v) {
      const postUrl = "api/admin_manager/spot";
      const spot = Object.assign({}, this.input_data, v);
      let indexPaymentWay = [];
      let indexSpotWorks = [];
      if (spot.spot_payment_ways) {
        indexPaymentWay = spot.spot_payment_ways.map(elem => {
          return { payment_way_id: elem };
        });
      }
      if (spot.spot_works) {
        indexSpotWorks = spot.spot_works.map(elem => {
          return { category_id: elem };
        });
      }

      const formdata = {
        spot: spot,
        spot_sub_images: spot.spot_sub_images,
        spot_works: indexSpotWorks,
        spot_payment_ways: indexPaymentWay,
        spot_topic_rels: spot.spot_topic_rels
      };
      formdata.spot.tags = formdata.spot.input_tags.join(",");
      this.post_axios(postUrl, formdata).then(res => {
        this.$router.push({ name: "list_spot" });
      });
    },
    editOnSave(e) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/spot/" + this.id;
        const data = {};
        data[e.key] = e.data;
        const spot = Object.assign({}, this.input_data, data);
        const formdata = {
          spot: spot
        };
        formdata.spot.tags = formdata.spot.input_tags.join(",");
        this.put_axios(apiUrl, formdata).then(res => {
          // console.log(res);
          this.onLoad(this.id);
        });
      }
    },
    editMainImages(image_url) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/spot/" + this.id;
        const data = {
          main_image_url: image_url
        };
        const spot = Object.assign({}, this.input_data, data);
        const formdata = {
          spot: spot
        };
        this.put_axios(apiUrl, formdata).then(res => {
          // console.log(res);
          this.onLoad(this.id);
        });
      }
    },
    editSubImages(v, key) {
      if (!v.key || !v.data) {
        return;
      }
      const api = "api/admin_manager/spot/" + this.id + "/spot_sub_image";
      let oldimages = this.input_data[key];
      const images = v.data;
      oldimages = oldimages.filter(image => {
        if (!images.some(e => e.id === image.id)) {
          // 新しい配列にないので削除処理
        }
      });
      const apis = {
        get: [],
        post: [],
        put: []
      };
      images.forEach(elem => {
        if (elem.id && !elem.index) {
          apis.put.push([api + "/" + elem.id, elem]);
        } else {
          // store
          elem.spot_id = this.id;
          apis.post.push([api, elem]);
        }
      });
      console.log(api);
      this.axios_all(apis).then(res => {
        console.log(res);
        this.message_snackbar("編集しました");
        this.$nextTick(() => {
          this.onLoad(this.id);
        });
      });
    },
    deleteSubImages(v, key) {
      if (!v) {
        return;
      }
      const api = "api/admin_manager/spot/" + this.id + "/spot_sub_image/" + v;
      if (confirm("画像を削除します。よろしいですか？")) {
        this.delete_axios(api).then(res => {
          console.log(res);
          this.onLoad(this.id);
        });
      }
    },
    checkbox_callback(v, field_name) {
      if (!this.id) {
        return;
      }
      const id = this.id;
      const api_settings = {
        payment_way: {
          api: "/api/admin_manager/spot/" + id + "/spot_payment_way/",
          db_key: "payment_way_id"
        },
        work: {
          api: "/api/admin_manager/spot/" + id + "/spot_work/",
          db_key: "category_id"
        }
      };
      const key = v.field.key;
      const api_name = api_settings[field_name].api;
      const db_key = api_settings[field_name].db_key;
      const postData = {};
      postData.spot_id = id;
      postData[db_key] = v.value;
      if (v.event) {
        // post
        this.post_axios(api_name, postData).then(res => {
          console.log(res);
        });
      } else {
        // delete
        this.post_axios(api_name + v.value + "/by_category_id", postData).then(
          res => {
            console.log(res);
          }
        );
      }
    }
  }
};
</script>
<style scoped></style>
