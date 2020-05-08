<template>
  <div class="container pt-3">
    <h3 class="title-cs">
      <font-awesome-icon :icon="icon" class="sidebar-icon-i" />
      {{ title }}
    </h3>
    <hr />
    <router-view @title=" v => { title = v;}" />
  </div>
</template>
<script>
export default {
  name: "Common",
  props: {
    icon: {
      type: String,
      default: ""
    }
  },
  data: () => {
    return {
      title: ""
    };
  }
};
</script>
<style scoped></style>
