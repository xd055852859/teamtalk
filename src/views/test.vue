<script setup lang="ts">
import { ElMessage } from "element-plus";
</script>
<template>
  <div style="width: 100%; height: calc(100vh - 55px)">
    <div style="width: 100%; height: 2000px">
      Scroll down to see the bottom-right button.
    </div>

    <el-backtop :right="20" :bottom="20" />
  </div>
</template>
<style scoped lang="scss"></style>
<style></style>
