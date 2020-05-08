<template>
  <div class="mb-3">
    <transition-group name="flip" tag="div">
      <template v-for="(imageForm, formIndex) in imageForms">
        <form-file
          :key="JSON.stringify(imageForm.index || imageForm.preview_image_url)"
          :field="field"
          :image-index="formIndex"
          :res="imageForm.preview_image_url || imageForm.image_input_path"
          :res-caption="imageForm.caption"
          :parent-id="parentId"
          :post-image-url="postImageUrl"
          :posttype="posttype"
          @order-up="orderup"
          @order-down="orderdown"
          @uploaded="uploadedImage($event, formIndex)"
          @onCaptionChange="uploadedCaption($event, formIndex)"
          @deleteImage="deleteImage($event, formIndex)"
        />
      </template>
    </transition-group>
    <b-button @click="addImageForm(field.key)">
      <font-awesome-icon icon="plus-square" />&nbsp;サブ画像を追加する
    </b-button>
  </div>
</template>
<script>
import formFile from "@/components/formHelper/formFile";
export default {
  name: "FormImages",
  components: {
    formFile
  },
  props: {
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
    data: {
      type: Array,
      default: () => {
        return {};
      }
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
      input_data: {},
      fields_data: {},
      images: {},
      imageForms: []
    };
  },
  computed: {},
  watch: {
    data: {
      handler(newVal) {
        this.imageForms = Object.assign([], newVal);
      },
      deep: true,
      immediate: true
    },
    field: {
      handler(newVal) {
        if (this.imageForms.length == 0) {
          this.imageForms.push({ index: Date() });
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    state(valid = [], data = null) {
      if (this.invalidFeedback(valid, data) == "") return true;
    },
    invalidFeedback(valid = [], data = null) {
      // バリデーションルールはここで設定
      if (valid.indexOf("require") >= 0 && !!data) {
        return "必須入力です";
      }
    },
    validFeedback(valid = [], data = null) {
      // バリデーションに通った時のメッセージ
    },
    setImage(fileObject) {
      this.$emit("setImage", fileObject);
    },
    addImageForm(key) {
      this.imageForms.push({ index: Date() });
    },
    uploadedImage(e, formIndex) {
      console.log(e, formIndex);
      Object.assign(this.imageForms[formIndex], {
        image_input_path: e.file_path,
        preview_image_url: e.preview_image_url || e.file_url,
        image_url: e.file_url
      });
      this.emitImages();
    },
    uploadedCaption(e, formIndex) {
      this.$set(this.imageForms[formIndex], "caption", e);
      this.emitImages();
    },
    emitImages() {
      this.$emit("uploaded", this.imageForms);
    },
    orderup(index) {
      this.imageForms = this.orderupArray(this.imageForms, index);
      this.emitImages();
    },
    orderdown(index) {
      this.imageForms = this.orderdownArray(this.imageForms, index);
      this.emitImages();
    },
    deleteImage(formIndex) {
      const target = this.imageForms[formIndex];
      this.field.deleteSubImage(target.id);
    }
  }
};
</script>

<style lang="scss">
.flip {
  // 要素が移動するときのアニメーション設定（基本的にはtransitionにtransformを設定していればいい）
  &-move {
    transition: transform 0.5s;
  }

  // 要素が入るときのアニメーション
  &-enter {
    // アニメーションの初期設定（初期値とtransitionを設定する）
    &-active {
      opacity: 0;
      transform: translate3d(0, -30px, 0);
      transition: opacity 0.5s, transform 0.5s;
    }
    // アニメーション開始（目標のプロパティ値を設定する）
    &-to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  // 要素が消える時のアニメーション
  &-leave {
    // アニメーションの初期設定
    &-active {
      // 要素が消える場合はabsoluteにする（重要！）
      position: absolute;
      transition: opacity 0.5s, transform 0.5s;
    }
    // アニメーション開始
    &-to {
      opacity: 0;
      transform: translate3d(0, -30px, 0);
    }
  }
}
</style>
