<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
const props = defineProps<{ noIcon?: boolean }>();
const emits = defineEmits(["clickBack"]);
//    router.push('/invite');
//store.dispatch('auth/getGroupList');
</script>
<template>
  <div
    class="common-header"
    :class="props.noIcon ? 'dp-center-center' : 'dp-space-center'"
  >
    <el-icon
      style="margin-right: 10px; cursor: pointer"
      size="20px"
      @click="emits('clickBack')"
      v-if="!props.noIcon"
    >
      <arrow-left />
    </el-icon>
    <div class="title"><slot name="title"></slot></div>

    <slot name="right"></slot>
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
