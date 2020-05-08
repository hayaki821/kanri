<template>
  <b-form-group
    :id="'fieldset-' + field.key"
    :description="field.descritption || ''"
    :label="name != null ? name : field.name"
    :label-for="'selects-' + field.key"
    :label-cols="computeLabelCol"
    :class="field.name ? 'mb-5' : ''"
  >
    <b-form-file
      v-model="image"
      placeholder="画像を選択かドラッグ&ドロップして下さい"
      :accept="field.accept || 'image/jpeg, image/png, image/gif'"
      @change="onFileChange"
    ></b-form-file>
    <b-row v-show="Boolean(image) || origin_image_url" class="mt-3">
      <b-col>
        <img
          v-show="preimage"
          class="preview-item-file img-fluid"
          :src="preimage.length ? preimage : origin_image_url"
          alt
        />
      </b-col>
      <b-col>
        <b-form-input
          v-if="field.caption"
          :id="'input-caption' + field.key + imageIndex"
          v-model="caption"
          trim
          class="mb-3"
          @change="onCaptionChange"
        />
        <b-button-group v-if="field.caption">
          <b-button @click="$emit('order-up', imageIndex)">上げる</b-button>
          <b-button @click="$emit('order-down', imageIndex)">下げる</b-button>
        </b-button-group>
        <b-button variant="danger" @click="remove(imageIndex)">Cancel</b-button>
      </b-col>
    </b-row>
  </b-form-group>
</template>
<script>
export default {
  name: "FormFile",
  props: {
    name: {
      type: String,
      default: null
    },
    imageIndex: {
      type: Number,
      default: null
    },
    posttype: {
      type: String,
      default: ""
    },
    parentId: {
      type: Number,
      default: 0
    },
    postImageUrl: {
      type: String,
      default: ""
    },
    res: {
      type: String,
      default: ""
    },
    resCaption: {
      type: String,
      default: ""
    },
    field: {
      type: Object,
      default: () => {
        return [];
      }
    }
  },
  data: () => {
    return {
      origin_image_url: null,
      image: null,
      caption: null,
      preimage: []
    };
  },
  computed: {
    computeLabelCol() {
      if (this.name == "") return 0;
      if (this.name != "" && this.name != null) return 0;
      if (this.field.name) return 3;
      return 0;
    }
  },
  watch: {
    res: {
      handler(newVal) {
        this.origin_image_url = newVal;
        console.log(this.origin_image_url);
      },
      deep: true,
      immediate: true
    },
    resCaption: {
      handler(newVal) {
        this.caption = newVal;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onCaptionChange() {
      this.$emit("onCaptionChange", this.caption);
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      const file = files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.preimage = e.target.result;
      };
      reader.readAsDataURL(file);
      this.getServerPath(file).then(fileData => {
        this.$emit("uploaded", fileData);
      });
    },
    remove(index) {
      this.image = null;
      if (this.origin_image_url) {
        this.$emit("deleteImage", index);
      }
      this.$emit("onCaptionChange", null);
    },
    async getServerPath(fileObject) {
      // 画像をアップロードするAPI部分
      // console.log(fileObject);
      if (fileObject && this.postImageUrl) {
        var formData = new FormData();
        formData.append("file", fileObject);
        if (this.posttype && this.parentId) {
          formData.append(this.posttype + "_id", this.parentId);
        }
        const header = {
          "Content-Type": "multipart/form-data"
        };
        return await this.post_axios(this.postImageUrl, formData, header, true)
          .then(res => {
            return res.data || null;
          })
          .catch(err => {
            console.log(err.response);
            this.error_axios(err);
          });
      }
    }
  }
};
</script>
