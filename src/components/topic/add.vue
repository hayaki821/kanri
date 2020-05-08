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
  topic_title: null,
  catch_copy: null,
  topic_at: null,
  topic_category_id: null,
  topic_url: null,
  writer_id: null,
  main_image_input_path: null,
  pdf_url: null,
  input_tags: null,
  topic_contents_rels: [{ index: 0 }],
  spot_topic_rels: [],
  course_topic_rels: [],
  spots: [],
  topics: []
};
export default {
  name: "TopicAdd",
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
      posttype: "topic",
      postImageUrl: "/api/admin_manager/topic/image_upload",
      input_data: Object.assign({}, initialData),
      fields_data: [
        {
          key: "topic_title",
          name: "タイトル",
          type: "string",
          length: 255,
          required: true
        },
        {
          key: "catch_copy",
          name: "キャッチコピー",
          type: "text",
          length: null,
          required: true
        },
        {
          key: "topic_at",
          name: "掲載日",
          type: "date",
          length: null,
          required: true
        },
        {
          key: "topic_category_id",
          name: "特集分類",
          type: "select",
          options: this.setOptions("topic_category_id")
        },
        {
          key: "topic_url",
          name: "関連URL",
          type: "string",
          length: null
        },
        { key: "writer_id", name: "ライター", type: "string", length: null },
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
          key: "pdf_url",
          name: "PDF",
          type: "pdf"
        },
        { key: "input_tags", name: "タグ", type: "tags", length: 512 },
        {
          key: "topic_contents",
          name: "特集コンテンツ",
          type: "contents",
          origin: "preview_image_url",
          options: [],
          editCallBack: v => {
            this.relation_callback(v, "topic_contents");
          },
          editContentsImage: v => {
            this.edit_contents_image(v);
          },
          deleteRelations: v => {
            this.delete_relation_callback(v, "topic_contents");
          },
          viewThumbnail: v => {
            return this.relation_thumbnail(v, "topic_contents");
          }
        },
        {
          key: "spot_topic_rels",
          name: "関連スポット",
          type: "relations",
          options: [],
          name_key: "spot_name",
          rel_key: "spot",
          sub_name_key: "spot_name",
          no_order: true,
          editCallBack: v => {
            this.relation_callback(v, "spot_topic_rels");
          },
          deleteRelations: v => {
            this.delete_relation_callback(v, "spot_topic_rels");
          },
          viewThumbnail: v => {
            return this.relation_thumbnail(v, "spot_topic_rels");
          }
        },
        {
          key: "course_topic_rels",
          name: "関連コース",
          type: "relations",
          options: [],
          name_key: "course_name",
          rel_key: "course",
          sub_name_key: "course_name",
          no_order: true,
          editCallBack: v => {
            this.relation_callback(v, "course_topic_rels");
          },
          deleteRelations: v => {
            this.delete_relation_callback(v, "course_topic_rels");
          },
          viewThumbnail: v => {
            return this.relation_thumbnail(v, "course_topic_rels");
          }
        },
        { key: "order", name: "並び順", type: "string", length: null }
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
          if (elem.key === "spot_topic_rels") {
            elem.options = options;
          }
        });
      });
      this.get_axios("api/admin_manager/course?filter=not_trash").then(res => {
        this.courses = res.data;
        const options = res.data.map(elem => {
          return { value: elem, text: elem.course_name };
        });
        this.fields_data.map(elem => {
          if (elem.key === "course_topic_rels") {
            elem.options = options;
          }
        });
      });
    },
    onLoad(id) {
      if (!(Number(id) > 0)) {
        const topic_category_id_list = this.fields_data.filter(elem => {
          return elem.key === "topic_category_id";
        })[0];
        const topic_category_id = topic_category_id_list.options[0].value;
        const initialTopic = { topic_category_id: topic_category_id };
        this.input_data = Object.assign({}, initialData, initialTopic);
        return;
      }
      const postUrl = "api/admin_manager/topic/";
      this.get_axios(postUrl + this.id).then(res => {
        const data = res.data;
        let index = 0;
        data["topic_contents"].map((e, i) => (e.index = i));
        data["spot_topic_rels"].map((e, i) => (e.index = i));
        data["course_topic_rels"].map((e, i) => (e.index = i));
        data.topic_at = moment(data.topic_at).format("YYYY-MM-DD");
        this.input_data = Object.assign({}, res.data);
      });
    },
    save(v) {
      const postUrl = "api/admin_manager/topic";
      const topic = Object.assign({}, this.input_data, v);
      let indexTopicContents = [];
      let indexSpotTopicrels = [];
      let indexCourseTopicRels = [];
      let order = 0;
      if (topic.topic_contents) {
        indexTopicContents = topic.topic_contents.map(elem => {
          elem.order = order;
          order++;
          return elem;
        });
      }
      if (topic.spot_topic_rels) {
        indexSpotTopicrels = topic.spot_topic_rels.map(elem => {
          elem.spot_id = elem.id;
          elem.order = order;
          order++;
          return elem;
        });
      }
      if (topic.course_topic_rels) {
        indexCourseTopicRels = topic.course_topic_rels.map(elem => {
          elem.course_id = elem.id;
          elem.order = order;
          order++;
          return elem;
        });
      }
      const formdata = {
        topic: topic,
        topic_contents: topic.topic_contents,
        spot_topic_rels: indexSpotTopicrels,
        course_topic_rels: indexCourseTopicRels
      };
      this.post_axios(postUrl, formdata).then(res => {
        this.$router.push({ name: "list_topic" });
      });
    },
    editOnSave(e) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/topic/" + this.id;
        const data = {};
        data[e.key] = e.data;
        const topic = Object.assign({}, this.input_data, data);
        const formdata = {
          topic: topic
        };
        this.put_axios(apiUrl, formdata).then(res => {
          this.onLoad(this.id);
        });
      }
    },
    editMainImages(image_url) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/topic/" + this.id;
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
    relation_callback(data, field_name) {
      if (!this.id) {
        return;
      }
      const postData = data;
      const topic_id = this.id;
      const api_settings = {
        spot_topic_rels: {
          api1: "/api/admin_manager/spot/",
          api2: "/spot_topic_rel/",
          db_key: "id"
        },
        course_topic_rels: {
          api1: "/api/admin_manager/course/",
          api2: "/course_topic_rel/",
          db_key: "id"
        },
        topic_contents: {
          api1: "/api/admin_manager/topic/",
          api2: "/topic_content/",
          db_key: "topic_id"
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
      postData.forEach(elem => {
        elem.order = order++;
        if (field_name !== "topic_contents") {
          api_name =
            api_settings[field_name].api1 +
            elem[db_key] +
            api_settings[field_name].api2;
          if (elem.topic_id) {
            // apis.put.push([api_name + elem.id, elem]);
          } else {
            elem.topic_id = topic_id;
            elem.spot_id = elem.id;
            elem.course_id = elem.id;
            apis.post.push([api_name, elem]);
          }
        } else {
          api_name =
            api_settings[field_name].api1 +
            topic_id +
            api_settings[field_name].api2;
          if (elem.id) {
            apis.put.push([api_name + elem.id, elem]);
          } else {
            elem.topic_id = topic_id;
            apis.post.push([api_name, elem]);
          }
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
        spot_topic_rels: {
          api: "/api/admin_manager/spot/" + data.spot_id + "/spot_topic_rel/"
        },
        course_topic_rels: {
          api:
            "/api/admin_manager/topic/" + data.course_id + "/course_topic_rel/"
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
      if (key == "spot_topic_rels") {
        return v.spot ? v.spot.preview_image_url : "";
      } else if (key == "course_topic_rels") {
        return v.course ? v.course.preview_image_url : "";
      }
    }
  }
};
</script>
<style scoped></style>
