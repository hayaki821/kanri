<template>
  <b-form class="pb-5" @submit.prevent="onSubmit">
    <div class="text-right my-2">
      <b-button v-if="!editMode" variant="primary" type="submit">保存</b-button>
    </div>
    <template v-for="(field, index) in fields_data">
      <template v-if="field.type == 'string'">
        <b-form-group
          :id="'fieldset-' + field.key"
          :key="index"
          :description="field.descritption || ''"
          :label="field.name"
          :label-for="'input-' + field.key"
          label-cols="3"
          :invalid-feedback="invalidFeedback(index, input_data[field.key])"
          :valid-feedback="validFeedback(field.valid, input_data[field.key])"
          :state="state(index, input_data[field.key])"
        >
          <b-input-group>
            <b-form-input
              :id="'input-' + field.key"
              v-model="input_data[field.key]"
              trim
              :required="field.required || false"
              :disabled="editMode && !editfield[index]"
              :state="state(index, input_data[field.key])"
            />
            <b-input-group-append v-if="editMode">
              <b-button
                v-if="!editfield[index]"
                variant="outline-info"
                @click="$set(editfield, index, true)"
              >
                <font-awesome-icon icon="edit" />
              </b-button>
              <b-button v-if="editfield[index]" riant="info" @click="editOnSave(field.key, index)">
                <font-awesome-icon icon="save" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </template>
      <template v-if="field.type == 'number'">
        <b-form-group
          :id="'fieldset-' + field.key"
          :key="index"
          :description="field.descritption || ''"
          :label="field.name"
          :label-for="'input-' + field.key"
          label-cols="3"
          :invalid-feedback="invalidFeedback(index, input_data[field.key])"
          :valid-feedback="validFeedback(field.valid, input_data[field.key])"
          :state="state(index, input_data[field.key])"
        >
          <b-input-group>
            <b-form-input
              :id="'input-' + field.key"
              v-model.number="input_data[field.key]"
              trim
              type="number"
              :step="field.step || '1'"
              :required="field.required || false"
              :disabled="editMode && !editfield[index]"
            />
            <b-input-group-append v-if="editMode">
              <b-button
                v-if="!editfield[index]"
                variant="outline-info"
                @click="$set(editfield, index, true)"
              >
                <font-awesome-icon icon="edit" />
              </b-button>
              <b-button v-if="editfield[index]" riant="info" @click="editOnSave(field.key, index)">
                <font-awesome-icon icon="save" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </template>
      <template v-if="field.type == 'text'">
        <b-form-group
          :id="'fieldset-' + field.key"
          :key="index"
          :description="field.descritption || ''"
          :label="field.name"
          :label-for="'input-' + field.key"
          label-cols="3"
          :invalid-feedback="invalidFeedback(index, input_data[field.key])"
          :valid-feedback="validFeedback(field.valid, input_data[field.key])"
          :state="state(index, input_data[field.key])"
        >
          <b-input-group>
            <b-form-textarea
              :id="'input-' + field.key"
              v-model="input_data[field.key]"
              trim
              rows="4"
              :state="state(index, input_data[field.key])"
              :required="field.required || false"
              :disabled="editMode && !editfield[index]"
            />
            <b-input-group-append v-if="editMode">
              <b-button
                v-if="!editfield[index]"
                variant="outline-info"
                @click="$set(editfield, index, true)"
              >
                <font-awesome-icon icon="edit" />
              </b-button>
              <b-button v-if="editfield[index]" ariant="info" @click="editOnSave(field.key, index)">
                <font-awesome-icon icon="save" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </template>
      <template v-if="field.type == 'date'">
        <form-date-time
          :key="index"
          :field="field"
          :input-data="input_data[field.key]"
          :edit-mode="editMode"
          date-only
          @update="updateDateTime($event, field.key)"
          @editOnSave="editOnSaveDateTime($event, field)"
        ></form-date-time>
      </template>
      <template v-if="field.type == 'datetime'">
        <form-date-time
          :key="index"
          :field="field"
          :input-data="input_data[field.key]"
          :edit-mode="editMode"
          @update="updateDateTime($event, field.key)"
          @editOnSave="editOnSaveDateTime($event, field)"
        ></form-date-time>
      </template>
      <template v-if="field.type == 'map'">
        <div :key="index" class="map form-row form-group">
          <b-col cols="3">GPSから設定</b-col>
          <b-col>
            <GmapMap
              ref="map"
              :center="center"
              :zoom="zoom"
              style="width: 100%; height: 300px;"
              @center_changed="onCenterChanged"
            >
              <GmapMarker
                v-show="marker_center"
                icon
                :position="marker_center"
                :clickable="true"
                :draggable="false"
              ></GmapMarker>
            </GmapMap>
          </b-col>
          <b-col>
            <div>
              <p>
                <strong>GPS座標:</strong>
              </p>
              <p>lat:{{ marker_center.lat }}</p>
              <p>lng:{{ marker_center.lng }}</p>
              <p>
                <b-button @click="currentPosition">現在地へ移動</b-button>
              </p>
              <p>
                <b-button variant="primary" @click="setPosition">この座標で決定</b-button>
              </p>
            </div>
          </b-col>
        </div>
      </template>
      <template v-if="field.type == 'select'">
        <b-form-group
          :id="'fieldset-' + field.key"
          :key="index"
          :description="field.descritption || ''"
          :label="field.name"
          :label-for="'selects-' + field.key"
          label-cols="3"
        >
          <b-row no-gutters>
            <b-col>
              <b-form-select
                :id="'selects-' + field.key"
                v-model="input_data[field.key]"
                :options="field.options"
                :disabled="(editMode && !editfield[index]) || field.disabled"
              ></b-form-select>
            </b-col>
            <b-col v-if="editMode" style="max-width:44px;">
              <b-button
                v-if="!editfield[index]"
                variant="outline-info"
                :disabled="field.disabled"
                @click="$set(editfield, index, true)"
              >
                <font-awesome-icon icon="edit" />
              </b-button>
              <b-button v-if="editfield[index]" ariant="info" @click="editOnSave(field.key, index)">
                <font-awesome-icon icon="save" />
              </b-button>
            </b-col>
          </b-row>
        </b-form-group>
      </template>
      <template v-if="field.type == 'checkbox'">
        <b-form-group
          :id="'fieldset-' + field.key"
          :key="index"
          :description="field.descritption || ''"
          :label="field.name"
          :label-for="'selects-' + field.key"
          label-cols="3"
        >
          <b-form-checkbox-group
            :id="'checkbox-group-' + field.key"
            v-model="input_data[field.key]"
            :name="'checkbox-group-' + field.key"
            class="text-left"
          >
            <b-form-checkbox
              v-for="(val, key) in field.options"
              :key="key"
              :value="val.value"
              @change="editCheckbox(field, val.value, $event)"
            >{{ val.text }}</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </template>
      <template v-if="field.type == 'radio'">
        <b-form-group
          :id="'fieldset-' + field.key"
          :key="index"
          :description="field.descritption || ''"
          :label="field.name"
          :label-for="'selects-' + field.key"
          label-cols="3"
        >
          <b-form-radio-group
            :id="'checkbox-group-' + field.key"
            v-model="input_data[field.key]"
            :name="'checkbox-group-' + field.key"
            class="text-left"
          >
            <b-form-radio
              v-for="(val, key) in field.options"
              :key="key"
              :value="val.value"
              @change="editCheckbox(field, val.value, $event)"
            >{{ val.text }}</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </template>
      <template v-if="field.type == 'file'">
        <form-file
          :key="index"
          :field="field"
          :res="input_data[field.origin]"
          :parent-id="fieldParentId(field) || parentId"
          :post-image-url="postImageUrl"
          :posttype="posttype"
          @uploaded="setImage($event, field)"
        />
      </template>
      <template v-if="field.type == 'pdf'">
        <form-pdf
          :key="index"
          :field="field"
          :res="input_data[field.key]"
          :parent-id="fieldParentId(field) || parentId"
          :posttype="posttype"
          :edit-mode="editMode"
          @uploaded="v=>{$set(input_data, field.key, v)}"
          @changed="v=>{$set(input_data, field.key, v)}"
          @editField="editOnSave(field.key, index)"
        />
      </template>
      <template v-if="field.type == 'images'">
        <div :key="index">
          <form-images
            :data="input_data[field.key]"
            :field="field"
            :parent-id="parentId"
            :post-image-url="postImageUrl"
            :posttype="posttype"
            @uploaded="setImages($event, field.key)"
          />
          <b-form-group v-if="editMode">
            <b-button variant="info" @click="editOnSaveSubImages(field)">
              <font-awesome-icon icon="save" />&nbsp;サブ画像の編集を反映する
            </b-button>
          </b-form-group>
        </div>
      </template>
      <template v-if="field.type == 'tags'">
        <b-form-group
          :id="'fieldset-' + field.key"
          :key="index"
          :description="field.descritption || ''"
          :label="field.name"
          :label-for="'tags-' + field.key"
          label-cols="3"
        >
          <b-row no-gutters>
            <b-col>
              <b-form-tags
                :id="'tags-' + field.key"
                v-model="input_data[field.key]"
                class="mb-2"
                :disabled="editMode && !editfield[index]"
              ></b-form-tags>
            </b-col>
            <b-col v-if="editMode" cols="1">
              <b-button
                v-if="!editfield[index]"
                sm
                variant="outline-info"
                @click="$set(editfield, index, true)"
              >
                <font-awesome-icon icon="edit" />
              </b-button>
              <b-button v-if="editfield[index]" ariant="info" @click="editOnSave(field.key, index)">
                <font-awesome-icon icon="save" />
              </b-button>
            </b-col>
          </b-row>
        </b-form-group>
      </template>
      <template v-if="field.type == 'relations'">
        <form-relations
          :key="index"
          :fields-data="field"
          :input-data="input_data[field.key]"
          :edit-mode="editMode"
          :is-caption="field.isCaption"
          @updateInputData="updateRelations($event, field.key)"
          @editOnSaveRelations="editOnSaveRelations($event, field)"
          @deleteRelations="$emit('deleteRelations', $event)"
        />
      </template>
      <template v-if="field.type == 'contents'">
        <form-Contents
          :key="index"
          :fields-data="field"
          :input-data="input_data[field.key]"
          :edit-mode="editMode"
          :posttype="posttype"
          :parent-id="parentId"
          :post-image-url="postImageUrl"
          @updateInputData="updateContents($event, field.key)"
          @editOnSaveRelations="editOnSaveRelations($event, field)"
          @deleteContents="$emit('deleteContents', $event)"
        />
      </template>
    </template>
    <b-button v-if="!editMode" variant="primary" type="submit">保存</b-button>
  </b-form>
</template>
<script>
import formFile from "@/components/formHelper/formFile";
import formPdf from "@/components/formHelper/formPdf";
import formImages from "@/components/formHelper/formImages";
import formRelations from "@/components/formHelper/formRelations";
import formContents from "@/components/formHelper/formContents";
import formDateTime from "@/components/formHelper/formDateTime";
import moment from "moment";
export default {
  name: "FormHelper",
  components: {
    formFile,
    formPdf,
    formImages,
    formRelations,
    formContents,
    formDateTime
  },
  props: {
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
    postImageUrl: {
      type: String,
      default: ""
    },
    formData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    fieldsData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data: () => {
    return {
      options: [
        "Apple",
        "Orange",
        "Banana",
        "Lime",
        "Peach",
        "Chocolate",
        "Strawberry"
      ],
      search: "",
      selected: {},
      checked: {},
      editfield: {},
      input_data: {},
      fields_data: {},
      images: {},
      imageForms: [],
      center: { lat: 36.73034580086679, lng: 137.0754175767212 },
      marker_center: { lat: 36.73034580086679, lng: 137.0754175767212 },
      icon_center: {
        url: "",
        size: { width: 44, height: 70, f: "px", b: "px" },
        scaledSize: { width: 22, height: 35, f: "px", b: "px" }
      },
      zoom: 15,
      date_data: {},
      time_data: {}
    };
  },
  computed: {},
  watch: {
    formData: {
      handler(newVal) {
        this.center = newVal.map_center ?? {
          lat: 36.73034580086679,
          lng: 137.0754175767212
        };
        this.marker_center = this.center;
        this.input_data = Object.assign({}, newVal);
      },
      deep: true,
      immediate: true
    },
    fieldsData: {
      handler(newVal) {
        newVal.forEach(elem => {
          if (elem.type == "images") {
            this.imageForms = [...this.input_data[elem.key]];
            if (this.imageForms.length == 0) {
              this.imageForms.push({});
            }
          }
          if (elem.type == "relations") {
            const index = elem.key;
            this.selected[index] = [];
          }
        });
        this.fields_data = Object.assign({}, newVal);
      },
      deep: true,
      immediate: true
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
    onCenterChanged(center) {
      this.marker_center = { lat: center.lat(), lng: center.lng() };
    },
    currentPosition() {
      navigator.geolocation.getCurrentPosition(this.getCurrentPositionSuccess);
    },
    setPosition() {
      this.input_data.latitude = this.marker_center.lat;
      this.input_data.longitude = this.marker_center.lng;
    },
    getCurrentPositionSuccess(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.$refs.map.panTo({ lat: lat, lng: lng });
    },
    onSubmit() {
      this.$emit("save", this.input_data);
    },
    setImage(e, field) {
      this.$set(this.input_data, field.key, e.file_path);
      if (field.setImage) {
        this.$set(this.input_data, field.key, field.setImage(e));
      }
      if (this.editMode) {
        field.editMainImage(e.file_url);
      }
    },
    setImages(e, key) {
      let order = 0;
      Object.keys(e).forEach(index => {
        e[index].order = order;
        order++;
      });
      Object.assign(this.input_data[key], e);
    },
    editOnSave(key, index = false) {
      this.$emit("editOnSave", { key: key, data: this.input_data[key] });
      if (index) {
        this.$set(this.editfield, index, false);
      }
    },
    editOnSaveSubImages(field) {
      field.editSubImages({ key: field.key, data: this.input_data[field.key] });
    },
    updateRelations(e, key) {
      this.input_data[key] = e;
    },
    editOnSaveRelations(e, field) {
      field.editCallBack(e.data);
    },
    updateDateTime(e, key) {
      console.log(e);
      this.input_data[key] = e;
    },
    editOnSaveDateTime(e, field) {
      this.input_data[field.key] = e;
      this.editOnSave(field.key);
    },
    updateContents(e, key) {
      this.input_data[key] = e;
    },
    editOnSaveContents(e, field) {
      field.editCallBack(e.data);
    },
    editCheckbox(field, value, e) {
      field.editCallBack({
        field: field,
        value: value,
        event: e
      });
    },
    availableOptions(value = [], search = "", options = []) {
      const criteria = search.trim().toLowerCase();
      // Filter out already selected options
      const availanleOptions = options.filter(opt => value.indexOf(opt) === -1);
      if (criteria) {
        // Show only options that match criteria
        return availanleOptions.filter(
          opt => opt.toLowerCase().indexOf(criteria) > -1
        );
      }
      // Show all options available
      return availanleOptions;
    },
    onOptionClick({ option, addTag }) {
      addTag(option);
      this.search = "";
    },
    fieldParentId(field) {
      if (field.parentId) {
        return field.parentId(this.input_data);
      }
      return false;
    },
    changeDateTime(field_key) {
      const date = this.date_data[field_key];
      const time = this.time_data[field_key];
      if (date && time) {
        this.input_data[field_key] = moment(date + " " + time).format(
          "YYYY-MM-DD HH:mm"
        );
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
