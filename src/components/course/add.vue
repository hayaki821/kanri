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
  course_name: null,
  course_summary: null,
  span_time_text: null,
  span_time: null,
  distance: null,
  course_category_id: null,
  course_content: null,
  public_open_at: null,
  public_close_at: null,
  writer_id: null,
  main_image_input_path: null,
  course_sub_images: [],
  course_spot_metas: [],
  course_topic_rels: [],
  spots: [],
  topics: []
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
      postImageUrl: "/api/admin_manager/course/image_upload",
      input_data: Object.assign({}, initialData),
      fields_data: [
        {
          key: "course_name",
          name: "モデルコース名",
          type: "string",
          length: 255,
          required: true
        },
        {
          key: "course_summary",
          name: "コース概要文",
          type: "text",
          length: null,
          required: true
        },
        {
          key: "span_time_text",
          name: "所要時間（テキスト）",
          type: "string",
          length: null,
          required: true
        },
        {
          key: "span_time",
          name: "所要時間（分単位 数値）",
          type: "number",
          length: null,
          required: true
        },
        {
          key: "distance",
          name: "移動距離(km単位数値)",
          type: "number",
          length: null,
          required: true,
          step: "0.1"
        },
        {
          key: "course_category_id",
          name: "モデルコース分類",
          type: "select",
          options: this.setOptions("course_category_id")
        },
        { key: "course_content", name: "説明文", type: "text", length: null },
        {
          key: "public_open_at",
          name: "公開開始日",
          type: "date",
          length: 20
        },
        {
          key: "public_close_at",
          name: "公開終了日",
          type: "date",
          length: 20
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
          key: "course_sub_images",
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
        {
          key: "course_spot_metas",
          name: "スポット",
          type: "relations",
          options: [],
          name_key: "spot_name",
          rel_key: "spot",
          sub_name_key: "spot_name",
          editCallBack: v => {
            this.relation_callback(v, "course_spot_metas");
          },
          deleteRelations: v => {
            this.delete_relation_callback(v, "course_spot_metas");
          },
          viewThumbnail: v => {
            return this.relation_thumbnail(v, "course_spot_metas");
          },
          isCaption: true
        },
        {
          key: "course_topic_rels",
          name: "関連特集",
          type: "relations",
          options: [],
          name_key: "topic_title",
          rel_key: "topic",
          sub_name_key: "topic_title",
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
          if (elem.key === "course_spot_metas") {
            elem.options = options;
          }
        });
      });
      this.get_axios("api/admin_manager/topic?filter=not_trash").then(res => {
        this.topics = res.data;
        const options = res.data.map(elem => {
          return { value: elem, text: elem.topic_title };
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
        const course_category_id_list = this.fields_data.filter(elem => {
          return elem.key === "course_category_id";
        })[0];
        const course_category_id = course_category_id_list.options[0].value;
        const initialCourse = {
          course_category_id: course_category_id
        };
        this.input_data = Object.assign({}, initialData, initialCourse);
        return;
      }
      const postUrl = "api/admin_manager/course/";
      this.get_axios(postUrl + this.id).then(res => {
        const data = res.data;
        data["course_spot_metas"].map((e, i) => (e.index = i));
        data["course_topic_rels"].map((e, i) => (e.index = i));
        this.input_data = Object.assign({}, res.data);
      });
    },
    save(v) {
      const postUrl = "api/admin_manager/course";
      const course = Object.assign({}, this.input_data, v);
      let indexCourseSpotMetas = [];
      let indexCourseTopicRels = [];
      let order = 0;
      if (course.course_spot_metas) {
        indexCourseSpotMetas = course.course_spot_metas.map(elem => {
          elem.spot_id = elem.id;
          elem.order = order;
          order++;
          return elem;
        });
      }
      if (course.course_topic_rels) {
        indexCourseTopicRels = course.course_topic_rels.map(elem => {
          elem.topic_id = elem.id;
          return elem;
        });
      }
      const formdata = {
        course: course,
        course_sub_images: course.course_sub_images,
        course_spot_metas: indexCourseSpotMetas,
        course_topic_rels: indexCourseTopicRels
      };
      this.post_axios(postUrl, formdata).then(res => {
        this.$router.push({ name: "list_course" });
      });
    },
    editOnSave(e) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/course/" + this.id;
        const data = {};
        data[e.key] = e.data;
        const course = Object.assign({}, this.input_data, data);
        const formdata = {
          course: course
        };
        this.put_axios(apiUrl, formdata).then(res => {
          // console.log(res);
          this.onLoad(this.id);
        });
      }
    },
    editMainImages(image_url) {
      if (this.id) {
        const apiUrl = "/api/admin_manager/course/" + this.id;
        const data = {
          main_image_url: image_url
        };
        const course = Object.assign({}, this.input_data, data);
        const formdata = {
          course: course
        };
        this.put_axios(apiUrl, formdata).then(res => {
          // console.log(res);
          this.onLoad(this.id);
        });
      }
    },
    editSubImages(v, key) {
      if (!v.key || !v.data) return;
      const api = "api/admin_manager/course/" + this.id + "/course_sub_image";
      let oldimages = this.input_data[key];
      const images = v.data;
      oldimages = oldimages.filter(image => {
        if (!images.some(e => e.id === image.id)) {
          // 新しい配列にないので削除処理
        }
      });
      images.forEach(elem => {
        if (elem.id) {
          // update
          this.put_axios(api + "/" + elem.id, elem).then(res => {
            console.log(res);
          });
        } else {
          // store
          elem.spot_id = this.id;
          // elem.image_url = elem.image_input_path;
          this.post_axios(api, elem).then(res => {
            console.log(res);
          });
        }
      });
      console.log(v);
    },
    deleteSubImages(v, key) {
      if (!v) return;
      const api =
        "api/admin_manager/course/" + this.id + "/course_sub_image/" + v;
      if (confirm("画像を削除します。よろしいですか？")) {
        this.delete_axios(api).then(res => {
          console.log(res);
          this.onLoad(this.id);
        });
      }
    },
    relation_callback(data, field_name) {
      if (!this.id) return;
      const postData = data;
      const course_id = this.id;
      const api_settings = {
        course_spot_metas: {
          api: "/api/admin_manager/course/" + course_id + "/course_spot_meta/",
          db_key: "spot_id"
        },
        course_topic_rels: {
          api: "/api/admin_manager/course/" + course_id + "/course_topic_rel/",
          db_key: "topic_id"
        }
      };
      const api_name = api_settings[field_name].api;
      const db_key = api_settings[field_name].db_key;
      const apis = {
        get: [],
        post: [],
        put: []
      };
      this.is_loading(true);
      let order = 0;
      postData.forEach(elem => {
        elem.order = order++;
        if (elem.course_id) {
          apis.put.push([api_name + elem.id, elem]);
        } else {
          elem.course_id = course_id;
          elem[db_key] = elem.id;
          apis.post.push([api_name, elem]);
        }
      });
      this.axios_all(apis)
        .then(res => {
          console.log(res);
        })
        .finally(() => {
          this.onLoad(this.id);
          this.is_loading(false);
        });
    },
    delete_relation_callback(data, field_name) {
      const pre_api = "/api/admin_manager/course/" + this.id;
      const api_settings = {
        course_spot_metas: {
          api: pre_api + "/course_spot_meta/"
        },
        course_topic_rels: {
          api: pre_api + "/course_topic_rel/"
        }
      };
      const api_name = api_settings[field_name].api + data.id;
      if (window.confirm("削除します。よろしいですか。")) {
        this.is_loading(true);
        this.delete_axios(api_name)
          .then(res => {
            console.log(res);
            this.onLoad(this.id);
          })
          .finally(() => {
            this.is_loading(false);
          });
      }
    },
    relation_thumbnail(v, key) {
      if (key == "course_spot_metas") {
        return v.spot ? v.spot.preview_image_url : "";
      }
      if (key == "course_topic_rels") {
        const img_url = this.topics.find(e => e.id == v.topic.id);
        return img_url ? img_url.thumbnail_main_image_url : "";
      }
    }
  }
};
</script>
<style scoped></style>
