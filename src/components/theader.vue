<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
const emits = defineEmits(["clickBack"]);
//    router.push('/invite');
//store.dispatch('auth/getGroupList');
</script>
<template>
  <div class="common-header dp-space-center">
    <el-icon
      style="margin-right: 10px; cursor: pointer"
      size="20px"
      @click="emits('clickBack')"
    >
      <arrow-left />
    </el-icon>
    <div class="title"><slot name="title"></slot></div>

    <div><slot name="right"></slot></div>
  </div>
</template>
<style scoped lang="scss">
.common-header {
  width: 100%;
  height: 55px;
  text-align: center;
  .title {
    width: 65%;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
<style></style>
