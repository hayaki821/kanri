<template>
  <b-form-group
    :id="'fieldset-' + field.key"
    :description="field.descritption || ''"
    :label="name != null ? name : field.name"
    :label-for="'selects-' + field.key"
    :label-cols="computeLabelCol"
    :class="field.name ? 'mb-5' : ''"
  >
    <b-input-group prepend="PDFのURL">
      <b-form-input
        :id="'input-' + field.key"
        v-model="pdf_url"
        trim
        :disabled="editMode&&editfield"
        @change="onInputChange"
      />
      <b-input-group-append v-if="editMode">
        <b-button v-if="editfield" variant="outline-info" @click="editfield=false">
          <font-awesome-icon icon="edit" />
        </b-button>
        <b-button v-if="!editfield" riant="info" @click="editOnEmit()">
          <font-awesome-icon icon="save" />
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <b-input-group prepend="PDFアップロード">
      <b-form-file
        v-model="image"
        placeholder="PDFを選択かドラッグ&ドロップ"
        :accept="'application/pdf'"
        browse-text="選択"
        @change="onFileChange"
      ></b-form-file>
      <b-input-group-append>
        <b-button variant="danger" @click="remove()">削除</b-button>
      </b-input-group-append>
    </b-input-group>
    <b-button v-if="pdf_url" variant="outline-primary" class="mt-2" :href="pdf_url" target="_brank">
      <font-awesome-icon :icon="['far', 'file-pdf']" class="mr-1" />確認
    </b-button>
  </b-form-group>
</template>
<script>
export default {
  name: "FormPdf",
  props: {
    name: {
      type: String,
      default: null
    },
    res: {
      type: String,
      default: ""
    },
    field: {
      type: Object,
      default: () => {
        return [];
      }
    },
    editMode: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      pdf_url: null,
      image: null,
      postImageUrl: {
        type: String,
        default: "" // ここにPDFURL
      },
      editfield: true
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
        this.pdf_url = newVal;
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
    onInputChange() {
      this.$emit("changed", this.pdf_url);
    },
    editOnEmit() {
      this.editfield = true;
      this.$emit("editField");
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.getServerPath(file).then(file_url => {
        //this.pdf_urlにセット¥
        this.pdf_url = file_url;
        this.$emit("uploaded", file_url);
        this.$nextTick(() => {
          if (this.editMode) {
            this.editfield = true;
            this.$emit("editField");
          }
        });
      });
    },
    remove() {
      this.pdf_url = null;
      this.image = null;
      if (this.editMode) {
        this.$emit("editField");
      }
    },
    async getServerPath(fileObject) {
      // 画像をアップロードするAPI部分
      // console.log(fileObject);
      if (fileObject) {
        var formData = new FormData();
        formData.append("file", fileObject);
        if (this.posttype && this.parentId) {
          formData.append(this.posttype + "_id", this.parentId);
        }
        const header = {
          "Content-Type": "multipart/form-data"
        };
        return await this.post_axios(
          "api/admin_manager/pdf_upload",
          formData,
          header,
          true
        )
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
