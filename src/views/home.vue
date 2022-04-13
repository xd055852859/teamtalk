<script setup lang="ts">
import TalkHeader from "./header.vue";
import TalkContainer from "./container.vue";

import { ArrowDown } from "@element-plus/icons-vue";

</script>
<template>
  <div class="home">
    <talk-header />
    <talk-container />
  </div>
  <router-view></router-view>
</template>
<style scoped lang="scss">
.home {
  width: 100%;
  height: 100vh;
  background: var(--talk-bg-color);
}
.nav {
  width: 100%;
  height: 40px;
  padding: 0px 2.5%;
  box-sizing: border-box;
  .title {
    width: 100%;
    height: 100%;
    line-height: 40px;
    font-size: 18px;
    font-weight: 400;
    color: #03c160;
  }
}
.nav-container {
  width: 300px;
}
</style>
<style></style>
