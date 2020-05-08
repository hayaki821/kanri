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
        <b-row
          v-for="(relVal, relIndex) in input_data"
          :key="relVal.index"
          :class="
            'mb-2 border-left border-width-2 ' + rotateColor(relVal.index % 5)
          "
        >
          <b-col>
            <b-img :src="relThumnail(relVal)" fluid alt="Fluid image"></b-img>
          </b-col>
          <b-col sm="7" class="text-left">
            {{ relVal[field.rel_key] ? relVal[field.rel_key][field.sub_name_key] : relVal[field.name_key] }}
            <b-form-input
              v-if="isCaption"
              :id="'input-' + field.key + '-between-text-' + relIndex"
              v-model="input_data[relIndex].between_text"
              trim
              class="mt-3"
            />
          </b-col>
          <b-col
            sm="1"
            class="text-center text-secondary d-flex flex-column justify-content-center align-items-center"
          >
            <font-awesome-icon
              v-if="!field.no_order"
              icon="caret-square-up"
              size="lg"
              @click="orderup(relIndex, field)"
            />
            <font-awesome-icon
              icon="window-close"
              class="my-2 text-danger"
              size="lg"
              @click="remove(relIndex, field)"
            />
            <font-awesome-icon
              v-if="!field.no_order"
              icon="caret-square-down"
              size="lg"
              @click="orderdown(relIndex, field)"
            />
          </b-col>
        </b-row>
      </transition-group>
    </div>

    <b-form-group class="mt-3">
      <b-button sm variant="warning" @click="push_input_data(field.key)">リストに追加</b-button>
      <b-button v-if="editMode" variant="info" @click="editOnSaveRelations(field)">
        <font-awesome-icon icon="save" />&nbsp;変更を保存する
      </b-button>
    </b-form-group>
    <b-form-select v-model="selected" :options="field.options" multiple :select-size="5"></b-form-select>
  </b-form-group>
</template>
<script>
export default {
  name: "FormRelation",
  components: {},
  props: {
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
        return {};
      }
    },
    fieldsData: {
      type: Object,
      default: () => {
        return [];
      }
    },
    isCaption: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      options: [],
      selected: [],
      input_data: [],
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
      deep: true
    },
    input_data: {
      handler(newVal) {
        this.$emit("updateInputData", this.input_data);
      },
      deep: true
    }
  },
  methods: {
    push_input_data(key) {
      let nextIndex = this.input_data.slice(-1)[0]
        ? this.input_data.slice(-1)[0].index
        : 0;
      this.selected = this.selected.map(elem => {
        elem.index = ++nextIndex;
        return elem;
      });
      this.input_data = this.input_data.concat(this.selected);
      this.input_data = this.input_data.map(elem => {
        if (!elem.between_text) {
          elem.between_text = "";
        }
        return elem;
      });
      this.selected[key] = [];
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
      } else if (this.field.viewThumbnail) {
        return this.field.viewThumbnail(val);
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
        field.deleteRelations(this.input_data[index]);
      }
    },
    rotateColor(index) {
      const colors = [
        "border-primary",
        "border-success",
        "border-danger",
        "border-warning",
        "border-info"
      ];
      return colors[index];
    }
  }
};
</script>

<style lang="scss">
.border-width-2 {
  border-left-width: 5px !important;
}
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
