<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
import UserCenter from "@/views/userCenter.vue";
import IconFont from "./iconFont.vue";
const router = useRouter();
const props = defineProps<{
  noIcon?: boolean;
  headerIcon?: string;
  headerTitle?: string;
}>();
const themeVisible = ref<boolean>(false);
const menuVisible = ref<boolean>(true);

const back = () => {
  router.back();
  menuVisible.value = false;
};
</script>
<template>
  <div class="common-header" :class="'dp-center-center'">
    <!-- <el-icon
      style="margin-right: 10px; cursor: pointer"
      size="20px"
      @click="emits('clickBack')"
      v-if="!props.noIcon"
    >
      <arrow-left />
    </el-icon> -->
    <div class="left dp--center">
      <icon-font
        :name="'menu'"
        @mouseenter="themeVisible = true"
        style="cursor: pointer"
        v-if="headerIcon"
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
    <div class="right dp--center">
      <slot name="right"></slot>
      <icon-font
        :name="'close'"
        @click="back()"
        style="cursor: pointer; margin-left: 5px"
        v-if="!headerIcon"
      />
    </div>
  </div>
  <el-drawer
    v-model="themeVisible"
    direction="ltr"
    :with-header="false"
    :size="280"
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
  position: relative;
  z-index: 1;
  .title {
    width: 100%;
    font-size: 18px;
    font-weight: 600;
  }
  .left,
  .right {
    height: 100%;
    position: absolute;
    top: 0px;
    z-index: 5;
  }
  .left {
    left: 10px;
  }
  .right {
    right: 15px;
  }
}
</style>
<style></style>
