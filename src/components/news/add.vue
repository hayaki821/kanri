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
import moment from "moment";

const initialData = {
  title: "",
  public_start_at: null,
  public_end_at: null,
  main_image_url: "",
  content: "",
  news_url: "",
  pdf_url: ""
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
      posttype: "news",
      input_data: Object.assign({}, initialData),
      postImageUrl: "/api/admin_manager/news/image_upload",
      fields_data: [
        {
          key: "title",
          name: "タイトル",
          type: "string",
          length: null,
          required: true
        },
        {
          key: "public_start_at",
          name: "掲載開始日時",
          type: "date",
          length: null
        },
        {
          key: "public_end_at",
          name: "掲載終了日時",
          type: "date",
          length: null
        },
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
          key: "content",
          name: "本文",
          type: "text",
          length: null
        },
        {
          key: "news_url",
          name: "関連URL",
          type: "string",
          length: null
        },
        {
          key: "pdf_url",
          name: "PDFを添付",
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
  },
  methods: {
    onLoad(id) {
      if (!(Number(id) > 0)) {
        this.input_data = Object.assign({}, initialData);
        return;
      }
      const postUrl = "api/admin_manager/news/";
      this.get_axios(postUrl + this.id).then(res => {
        const data = res.data;
        //const toArray = {};
        data.public_start_at = moment(data.public_start_at).format(
          "YYYY-MM-DD"
        );
        data.public_end_at = moment(data.public_end_at).format("YYYY-MM-DD");
        this.input_data = Object.assign({}, data);
      });
    },
    editMainImages(image_url) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/news/" + this.id;
        const data = {
          main_image_url: image_url
        };
        const news = Object.assign({}, this.input_data, data);
        const formdata = news;
        console.log(formdata);
        this.put_axios(apiUrl, formdata).then(res => {
          // console.log(res);
          this.onLoad(this.id);
        });
      }
    },
    save(v) {
      const postUrl = "api/admin_manager/news";
      const news = Object.assign({}, this.input_data, v);
      const formdata = news;
      this.post_axios(postUrl, formdata).then(res => {
        this.$router.push({ name: "list_news" });
      });
    },
    editOnSave(e) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/news/" + this.id;
        const data = {};
        data[e.key] = e.data;
        const news = Object.assign({}, this.input_data, data);
        const formdata = news;
        this.put_axios(apiUrl, formdata).then(res => {
          // console.log(res);
          this.onLoad(this.id);
        });
      }
    }
  }
};
</script>