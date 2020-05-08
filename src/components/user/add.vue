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
      @editOnSave="editOnSave"
      @save="save"
    ></form-helper>
    <form-helper
      v-if="userLevel==5"
      :form-data="input_data.profile"
      :fields-data="writer_fields_data"
      :post-image-url="postImageUrl"
      :parent-id="input_data.profile.id"
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
  id: "",
  email: "",
  name: "",
  level: 5,
  profile: {
    id: "",
    user_id: "",
    nick_name: "",
    pr_text: "",
    web_url: "",
    twitter_url: "",
    instagram_url: "",
    facebook_url: "",
    youtube_url: "",
    avatar_url: ""
  }
};
export default {
  name: "UserAdd",
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
      posttype: "profile",
      postImageUrl: "/api/admin_manager/profile/image_upload",
      input_data: Object.assign({}, initialData),
      levels: {},
      userLevel: "",
      fields_data: [
        {
          key: "email",
          name: "Eメール",
          type: "string",
          invalid: { state: null }
        },
        { key: "name", name: "名前", type: "string", invalid: { state: null } },
        {
          key: "password",
          name: "パスワード",
          type: "string",
          invalid: { state: null }
        },
        {
          key: "level",
          name: "権限レベル",
          type: "select",
          options: this.level_options(),
          invalid: { state: null }
        }
      ],
      writer_fields_data: [
        {
          key: "nick_name",
          name: "ニックネーム",
          type: "string"
        },
        {
          key: "pr_text",
          name: "自己PR文章",
          type: "text"
        },
        {
          key: "web_url",
          name: "ウェブサイト",
          type: "string",
          length: 255
        },
        {
          key: "twitter_url",
          name: "Twitter",
          type: "string",
          length: 255
        },
        {
          key: "instagram_url",
          name: "instagram",
          type: "string",
          length: 255
        },
        {
          key: "facebook_url",
          name: "facebook",
          type: "string",
          length: 255
        },
        {
          key: "youtube_url",
          name: "youtube",
          type: "string",
          length: 255
        },
        {
          key: "avatar_url",
          name: "アバター画像",
          type: "file",
          origin: "preview_avatar_url",
          editMainImage: image_url => {
            this.editMainImages(image_url);
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
  },
  methods: {
    onLoad(id) {
      if (!(Number(id) > 0)) {
        this.input_data = Object.assign({}, initialData);
        return;
      }
      const postUrl = "api/admin_manager/user/";
      this.get_axios(postUrl + this.id).then(res => {
        this.input_data = Object.assign({}, res.data);
        this.userLevel = this.input_data.level;
      });
    },
    save(v) {
      const postUrl = "api/admin_manager/user";
      const user = Object.assign({}, this.input_data, v);
      const formdata = user;
      this.post_axios(postUrl, formdata)
        .then(res => {
          //console.log(res);
          this.$router.push({ name: "list_user" });
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
        const apiUrl = "/api/admin_manager/user/" + this.id;
        const apiProfileUrl =
          "/api/admin_manager/profile/" + this.input_data.profile.id;
        const profile = [
          "nick_name",
          "pr_text",
          "web_url",
          "twitter_url",
          "instagram_url",
          "facebook_url",
          "youtube_url",
          "avatar_url"
        ];
        const data = {};
        data[e.key] = e.data;
        if (profile.includes(e.key)) {
          const profile = Object.assign({}, this.input_data.profile, data);
          const formdata = profile;
          this.put_axios(apiProfileUrl, formdata).then(res => {
            // console.log(res);
            this.onLoad(this.id);
          });
        } else {
          const user = Object.assign({}, this.input_data, data);
          const formdata = user;
          this.put_axios(apiUrl, formdata).then(res => {
            // console.log(res);
            this.onLoad(this.id);
          });
        }
      }
    },
    editMainImages(image_url) {
      if (this.id) {
        const apiProfileUrl =
          "/api/admin_manager/profile/" + this.input_data.profile.id;
        const data = {
          avatar_url: image_url
        };
        const profile = Object.assign({}, this.input_data.profile, data);
        const formdata = profile;
        this.put_axios(apiProfileUrl, formdata).then(res => {
          //console.log(res);
          this.onLoad(this.id);
        });
      }
    },
    level_options() {
      const levels = this.$store.getters.getUserLevels;
      return Object.keys(levels).map(key => {
        return { value: key, text: levels[key] };
      });
    }
  }
};
</script>
<style scoped></style>
