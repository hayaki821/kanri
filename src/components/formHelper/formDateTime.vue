<template>
  <b-form-group
    :id="'fieldset-' + field.key"
    :description="field.descritption || ''"
    :label="field.name"
    :label-for="'input-' + field.key"
    label-cols="3"
  >
    <b-input-group>
      <b-form-datepicker
        :id="'input-date-' + field.key"
        v-model="date_data"
        trim
        :required="field.required || false"
        :disabled="editMode && !editfield"
        @input="changeDateTime(field.key)"
      ></b-form-datepicker>
      <b-form-timepicker
        v-if="!dateOnly"
        :id="'input-time-' + field.key"
        v-model="time_data"
        trim
        h23
        :required="field.required || false"
        :disabled="editMode && !editfield"
        @input="changeDateTime(field.key)"
      ></b-form-timepicker>
      <b-input-group-append v-if="editMode">
        <b-button
          v-if="!editfield"
          variant="outline-info"
          @click="editfield = true"
        >
          <font-awesome-icon icon="edit" />
        </b-button>
        <b-button v-if="editfield" riant="info" @click="editOnSave(field.key)">
          <font-awesome-icon icon="save" />
        </b-button>
      </b-input-group-append>
    </b-input-group>
  </b-form-group>
</template>
<script>
import moment from "moment";
export default {
  name: "FormDateTime",
  components: {},
  props: {
    dateOnly: {
      type: Boolean,
      default: false
    },
    inputData: {
      type: String,
      default: null
    },
    editMode: {
      type: Boolean,
      default: false
    },
    posttype: {
      type: String,
      default: ""
    },
    parentId: {
      type: Number,
      default: 0
    },
    field: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data: () => {
    return {
      editfield: null,
      date_data: null,
      time_data: null
    };
  },
  computed: {},
  watch: {
    inputData: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.date_data = moment(newVal).format("YYYY-MM-DD");
          if (!this.dateOnly) {
            this.time_data = moment(newVal).format("HH:mm");
          }
        }
      }
    }
  },
  methods: {
    state(index, data = null) {
      if (index == null) return false;
      const valid = this.fields_data[Number(index)].invalid || [];
      if (Object.keys(valid).includes("state")) {
        return valid.state;
      }
      if (this.invalidFeedback(valid, data) == "") return true;
    },
    invalidFeedback(index, data = null) {
      const valid = this.fields_data[Number(index)].invalid || [];
      // バリデーションルールはここで設定
      if (!Array.isArray(valid)) return "";
      if (valid.indexOf("require") >= 0 && !!data) {
        return "必須入力です";
      }
    },
    validFeedback(index, data = null) {
      // const valid = this.fields_data[Number(index)].valid || [];
      // バリデーションに通った時のメッセージ
    },
    editOnSave(key) {
      this.$emit("editOnSave", this.input_data);
      this.editfield = false;
    },
    changeDateTime(field_key) {
      const date = this.date_data;
      const time = this.time_data;
      if (this.dateOnly && date) {
        this.input_data = moment(date).format("YYYY-MM-DD");
      } else if (date && time) {
        this.input_data = moment(date + " " + time).format("YYYY-MM-DD HH:mm");
      }
      this.$emit("update", this.input_data);
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
