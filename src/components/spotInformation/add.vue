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
  spot_id: 1,
  title: null,
  public_start_at: null,
  public_end_at: null,
  main_image_url: null,
  content: null,
  information_url: null,
  pdf_url: null
};
export default {
  name: "SpotInfoAdd",
  components: { formHelper },
  props: {
    id: {
      type: Number,
      default: 0
    },
    spotId: {
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
          key: "spot_id",
          name: "対象スポット",
          type: "select",
          options: [],
          required: true,
          disabled: this.disableSpotID()
        },
        {
          key: "title",
          name: "タイトル",
          type: "string",
          length: null,
          required: true
        },
        {
          key: "public_start_at",
          name: "公開日",
          type: "date",
          length: null,
          required: false
        },
        {
          key: "public_end_at",
          name: "公開終了日",
          type: "date",
          length: null,
          required: false
        },
        {
          key: "main_image_url",
          name: "メイン写真",
          type: "file",
          origin: "preview_main_image_url",
          parentId: v => {
            return v ? v.spot_id : null;
          },
          setImage: v => {
            return v.file_url;
          },
          editMainImage: image_url => {
            this.editMainImages(image_url);
          }
        },
        {
          key: "content",
          name: "説明",
          type: "text",
          length: null,
          required: false
        },
        {
          key: "information_url",
          name: "お知らせURL",
          type: "string",
          length: null,
          required: false
        },
        {
          key: "pdf_url",
          name: "PDF",
          type: "pdf"
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
    this.initOptions();
  },
  methods: {
    disableSpotID() {
      if (this.$route.query.spotId > 0) {
        this.$nextTick(() => {
          this.input_data.spot_id = Number(this.$route.query.spotId);
        });
        return true;
      }
      return Boolean(this.spotId > 0);
    },
    initOptions() {
      this.get_axios("api/admin_manager/spot").then(res => {
        this.spots = res.data;
        const options = res.data.map(elem => {
          return { value: elem, text: elem.spot_name };
        });

        const options2 = res.data.map(elem => {
          return { value: elem.id, text: elem.spot_name };
        });
        this.fields_data.map(elem => {
          if (elem.key === "spot_id") {
            elem.options = options2;
          }
          if (elem.key === "spot_event_rels") {
            elem.options = options;
          }
        });
      });
    },
    onLoad(id) {
      if (!(Number(id) > 0)) {
        this.input_data = Object.assign({}, initialData);
        return;
      }
      const postUrl =
        "api/admin_manager/spot/" + this.spotId + "/spot_information/";
      this.get_axios(postUrl + this.id).then(res => {
        this.input_data = Object.assign({}, res.data);
        console.log(res);
      });
    },
    save(v) {
      const postUrl =
        "api/admin_manager/spot/" + v.spot_id + "/spot_information";
      const info = Object.assign({}, this.input_data, v);
      const formdata = info;
      formdata.spot_id = info.spot_id;
      this.post_axios(postUrl, formdata).then(res => {
        this.$router.push({
          name: "list_SpotInformation",
          params: { id: info.spot_id }
        });
      });
    },
    editOnSave(e) {
      if (this.id) {
        const apiUrl =
          "/api/admin_manager/spot/" +
          this.spotId +
          "/spot_information/" +
          this.id;
        const data = {};
        data[e.key] = e.data;
        const info = Object.assign({}, this.input_data, data);
        const formdata = info;
        this.put_axios(apiUrl, formdata).then(res => {
          this.onLoad(this.id);
        });
      }
    },
    editMainImages(image_url) {
      if (this.id) {
        const apiUrl =
          "/api/admin_manager/spot/" +
          this.input_data.spot_id +
          "/spot_information/" +
          this.id;
        const data = {
          main_image_url: image_url
        };
        const info = Object.assign({}, this.input_data, data);
        const formdata = info;
        this.put_axios(apiUrl, formdata).then(res => {
          // console.log(res);
          this.onLoad(this.id);
        });
      }
    }
  }
};
</script>
<style scoped></style>
