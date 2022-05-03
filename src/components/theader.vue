<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
import UserCenter from "@/views/userCenter.vue";
import IconFont from "./iconFont.vue";
const props = defineProps<{
  noIcon?: boolean;
  headerIcon?: string;
  headerTitle?: string;
}>();
const emits = defineEmits(["clickBack"]);
const themeVisible = ref<boolean>(false);
</script>
<template>
  <div
    class="common-header"
    :class="props.noIcon ? 'dp-center-center' : 'dp-space-center'"
  >
    <!-- <el-icon
      style="margin-right: 10px; cursor: pointer"
      size="20px"
      @click="emits('clickBack')"
      v-if="!props.noIcon"
    >
      <arrow-left />
    </el-icon> -->
    <div class="dp--center">
      <icon-font
        :name="headerIcon ? 'menu' : 'back'"
        @mouseenter="headerIcon ? (themeVisible = true) : null"
        @click="!headerIcon ? $router.back() : null"
        style="cursor: pointer"
      />
      <span
        style="margin-left: 10px; font-weight: bolder; font-size: 18px"
        v-if="headerTitle"
        >{{ headerTitle }}</span
      >
    </div>
    <!-- <el-icon
     
      size="20px"

    >
      <arrow-left />
    </el-icon> -->
    <div class="title"><slot name="title"></slot></div>
    <slot name="right"></slot>
  </div>
  <el-drawer
    v-model="themeVisible"
    direction="ltr"
    :with-header="false"
    :size="300"
  >
    <user-center @close="themeVisible = false" />
  </el-drawer>
</template>
<style scoped lang="scss">
.common-header {
  width: 100%;
  height: 55px;
  text-align: center;
  padding: 0px 10px;
  box-sizing: border-box;
  .title {
    width: 65%;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
<style></style>
