<template>
  <b-form-group
    :id="'fieldset-' + field.key"
    :key="index"
    :description="field.descritption || ''"
    :label="field.name"
    :label-for="'tags-' + field.key"
    label-cols="3"
    class="my-5"
  >
    <div class="container-fluid">
      <p v-if="!Array.isArray(input_data) || input_data.length <= 0">リストはありません。</p>
      <transition-group name="flip" tag="div">
        <b-row v-for="(relVal, relIndex) in input_data" :key="relVal.index" class="mb-2">
          <b-col sm="1" class="text-center bg-secondary text-white d-flex align-items-center">
            <span>{{ relIndex }}</span>
          </b-col>
          <b-col sm="10" class="text-left">
            見出し
            <b-form-input
              :id="'input-' + field.key + '-heading-' + relIndex"
              v-model="input_data[relIndex].heading"
              trim
              class="mb-3"
            />内容
            <b-form-textarea
              :id="'input-' + field.key + '-content-' + relIndex"
              v-model="input_data[relIndex].content"
              rows="5"
              trim
              class="mb-3"
            />
            <form-file
              :key="index"
              :field="field"
              :res="input_data[relIndex][field.origin]"
              :parent-id="parentId"
              :post-image-url="postImageUrl"
              :posttype="posttype"
              :name="''"
              @uploaded="setImage($event, relIndex)"
            />
          </b-col>
          <b-col
            sm="1"
            class="text-center text-secondary d-flex flex-column justify-content-center align-items-center"
          >
            <font-awesome-icon icon="caret-square-up" size="lg" @click="orderup(relIndex, field)" />
            <font-awesome-icon
              icon="window-close"
              class="my-2 text-danger"
              size="lg"
              @click="remove(relIndex, field)"
            />
            <font-awesome-icon
              icon="caret-square-down"
              size="lg"
              @click="orderdown(relIndex, field)"
            />
          </b-col>
        </b-row>
      </transition-group>
    </div>

    <b-form-group class="mt-3">
      <b-button sm variant="warning" @click="push_input_content()">コンテンツを追加</b-button>
      <b-button v-if="editMode" variant="info" @click="editOnSaveRelations(field)">
        <font-awesome-icon icon="save" />&nbsp;変更を保存する
      </b-button>
    </b-form-group>
  </b-form-group>
</template>
<script>
import formFile from "@/components/formHelper/formFile";
export default {
  name: "FormContent",
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
    index: {
      type: Number,
      default: 0
    },
    editMode: {
      type: Boolean,
      default: false
    },
    inputData: {
      type: Array,
      default: () => {
        return [{}];
      }
    },
    fieldsData: {
      type: Object,
      default: () => {
        return [];
      }
    }
  },
  data: () => {
    return {
      options: [],
      selected: [],
      input_data: [{ index: 0 }],
      field: {}
    };
  },
  computed: {},
  watch: {
    inputData: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.input_data = newVal;
        }
      },
      deep: true
    },
    fieldsData: {
      handler(newVal) {
        this.field = newVal;
      },
      deep: true,
      immediate: true
    },
    input_data: {
      handler(newVal) {
        this.$emit("updateInputData", this.input_data);
      },
      deep: true
    }
  },
  methods: {
    push_input_content(key) {
      let nextIndex = this.input_data.slice(-1)[0]
        ? this.input_data.slice(-1)[0].index
        : 0;
      this.input_data.push({ index: ++nextIndex });
    },
    orderup(index, field) {
      const res = this.orderupArray(this.input_data, index);
      this.input_data = res;
    },
    orderdown(index, field) {
      const res = this.orderdownArray(this.input_data, index);
      this.input_data = res;
    },
    relThumnail(val, field) {
      if (val.thumbnail_main_image_url) {
        return val.thumbnail_main_image_url;
      } else {
        if (this.field.viewThumbnail) {
          return this.field.viewThumbnail(val);
        }
      }
    },
    setImage(e, index) {
      this.input_data[index].image_url = e.file_url;
      if (e.file_path) {
        this.input_data[index].image_input_path = e.file_path;
      }
    },
    editOnSaveRelations(field) {
      this.$emit("editOnSaveRelations", {
        data: this.input_data,
        key: field.key
      });
    },
    remove(index, field) {
      console.log(this.input_data[index]);
      if (!this.input_data[index][field.rel_key]) {
        this.input_data.splice(index, 1);
        this.$emit("updateInputData", this.input_data);
      } else {
        field.deleteRelations(this.input_data[index].id);
      }
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
