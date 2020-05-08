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
  title: null,
  public_start_at: null,
  public_end_at: null,
  event_start_at: null,
  event_end_at: null,
  main_image_url: null,
  content: null,
  event_url: null,
  pdf_url: null,
  place: null,
  open: null,
  inquiry: null,
  event_spot_rels: []
};
export default {
  name: "EventAdd",
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
      posttype: "event",
      postImageUrl: "/api/admin_manager/event/image_upload",
      input_data: Object.assign({}, initialData),
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
          key: "event_start_at",
          name: "イベント開始日",
          type: "datetime",
          length: null,
          required: false
        },
        {
          key: "event_end_at",
          name: "イベント終了日",
          type: "datetime",
          length: null,
          required: false
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
          name: "説明",
          type: "text",
          length: null,
          required: false
        },
        {
          key: "event_url",
          name: "イベントURL",
          type: "string",
          length: null,
          required: false
        },
        {
          key: "pdf_url",
          name: "PDF",
          type: "pdf"
        },
        {
          key: "place",
          name: "場所",
          type: "text",
          length: null,
          required: false
        },
        {
          key: "open",
          name: "open",
          type: "text",
          length: null,
          required: false
        },
        {
          key: "inquiry",
          name: "お問い合わせ",
          type: "text",
          length: null,
          required: false
        },
        {
          key: "event_spot_rels",
          name: "関連スポット",
          type: "relations",
          options: [],
          name_key: "spot_name",
          rel_key: "spot",
          sub_name_key: "spot_name",
          no_order: true,
          editCallBack: v => {
            this.relation_callback(v, "event_spot_rels");
          },
          deleteRelations: v => {
            this.delete_relation_callback(v, "event_spot_rels");
          },
          viewThumbnail: v => {
            return this.relation_thumbnail(v, "event_spot_rels");
          }
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
    initOptions() {
      this.get_axios("api/admin_manager/spot?filter=not_trash").then(res => {
        this.spots = res.data;
        const options = res.data.map(elem => {
          return { value: elem, text: elem.spot_name };
        });
        this.fields_data.map(elem => {
          if (elem.key === "event_spot_rels") {
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
      const postUrl = "api/admin_manager/event/";
      this.get_axios(postUrl + this.id).then(res => {
        const data = res.data;
        data["event_spot_rels"].map((e, i) => (e.index = i));
        this.input_data = Object.assign({}, res.data);
      });
    },
    save(v) {
      const postUrl = "api/admin_manager/event";
      const event = Object.assign({}, this.input_data, v);
      let indexSpotEventrels = [];
      let order = 0;
      if (event.event_spot_rels) {
        indexSpotEventrels = event.event_spot_rels.map(elem => {
          elem.spot_id = elem.id;
          elem.order = order;
          order++;
          return elem;
        });
      }
      const formdata = {
        event: event,
        event_spot_rels: indexSpotEventrels
      };
      console.log(formdata, event);
      this.post_axios(postUrl, formdata).then(res => {
        this.$router.push({ name: "list_event" });
      });
    },
    editOnSave(e) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/event/" + this.id;
        const data = {};
        data[e.key] = e.data;
        const event = Object.assign({}, this.input_data, data);
        const formdata = {
          event: event
        };
        this.put_axios(apiUrl, formdata).then(res => {
          // console.log(res);
          this.onLoad(this.id);
        });
      }
    },
    editMainImages(image_url) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/event/" + this.id;
        const data = {
          main_image_url: image_url
        };
        const event = Object.assign({}, this.input_data, data);
        const formdata = {
          event: event
        };
        this.put_axios(apiUrl, formdata).then(res => {
          // console.log(res);
          this.onLoad(this.id);
        });
      }
    },
    relation_callback(data, field_name) {
      if (!this.id) {
        return;
      }
      const postData = data;
      const event_id = this.id;
      const api_settings = {
        event_spot_rels: {
          api1: "/api/admin_manager/event/",
          api2: "/event_spot_rel/",
          db_key: "id"
        }
      };
      let api_name = api_settings[field_name].api1;
      const db_key = api_settings[field_name].db_key;
      const apis = {
        get: [],
        post: [],
        put: []
      };
      let order = 0;
      api_name =
        api_settings[field_name].api1 +
        event_id +
        api_settings[field_name].api2;
      postData.forEach(elem => {
        elem.order = order++;
        if (elem.event_id) {
          //すでにデータがあるときは上書きしない
          // apis.put.push([api_name + elem.id, elem]);
        } else {
          elem.event_id = event_id;
          elem.spot_id = elem.id;
          apis.post.push([api_name, elem]);
        }
      });
      this.is_loading(true);
      this.axios_all(apis)
        .then(res => {
          this.message_snackbar("編集しました");
        })
        .finally(() => {
          this.is_loading(false);
        });
    },
    delete_relation_callback(data, field_name) {
      const api_settings = {
        event_spot_rels: {
          api: "/api/admin_manager/event/" + this.id + "/event_spot_rel/"
        }
      };
      const api_name = api_settings[field_name].api + data.id;
      if (window.confirm("削除します。よろしいですか。")) {
        this.is_loading(true);
        this.delete_axios(api_name)
          .then(res => {
            console.log(res);
          })
          .finally(() => {
            this.onLoad(this.id);
            this.is_loading(false);
          });
      }
    },
    relation_thumbnail(v, key) {
      if (key == "event_spot_rels") {
        return v.spot ? v.spot.preview_image_url : "";
      } else if (key == "event_spot_rels") {
        return v.course ? v.course.preview_image_url : "";
      }
    }
  }
};
</script>
<style scoped></style>
