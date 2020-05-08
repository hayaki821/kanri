<template>
  <content>
    <header-nav />
    <div id="main" class="d-flex">
      <sidebar />
      <div class="content">
        <router-view />
      </div>
    </div>
  </content>
</template>

<script>
import headerNav from "@/components/header";
import sidebar from "@/components/sidebar";
import axios from "axios";
export default {
  name: "Container",
  components: {
    headerNav,
    sidebar
  }
};
</script>

<style scoped>
.content {
  flex-grow: 10;
  margin-left: 0px;
}

@media (min-width: 600px) {
  .slide + .content {
    margin-left: -250px;
  }
  .slide:not(.show) + .content {
    margin-left: -250px;
    transition: margin-left 0.4s;
  }
  .slide.show + .content {
    /* margin-left: -250px; */
    /* transition: margin-left 0.4s; */
    animation: slide_show 0.4s;
  }
}
@keyframes slide_show {
  0% {
    margin-left: -250px;
  }
  100% {
    margin-left: 0;
  }
}
</style>
