<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from "@tiptap/vue-3";
import { useDebounceFn } from "@vueuse/core";
import { watchPostEffect } from "vue";

const props = defineProps(nodeViewProps);
const moveState = ref<boolean>(false);
const percent = ref<number>(0);
const barRef = ref<any>(null);
const barleft = ref<number>(0);
const progressRef = ref<any>(null);
onMounted(() => {
  percent.value = props?.node?.attrs.percent;
});
const moveProgress = useDebounceFn((e) => {
  let event = e || window.event;
  // let leftVal = event.clientX - barRef.current.offsetLeft;
  console.log(e.clientX);
  console.log(progressRef.value.getBoundingClientRect().left);
  console.log(progressRef.value.getBoundingClientRect().width);
  let left = progressRef.value.getBoundingClientRect().left;
  const width = progressRef.value.getBoundingClientRect().width;
  barleft.value = event.clientX - left;
  // barRef.current.style.left = barleft.value + "px";
  // console.log(barleft.value);
  percent.value = Math.round((barleft.value / width) * 100);
  if (percent.value > 100) {
    percent.value = 100;
  } else if (percent.value < 0) {
    percent.value = 0;
  }
  console.log(props.updateAttributes);
  if (props.updateAttributes) {
    props.updateAttributes({
      percent: percent.value,
    });
  }

  // percent.value = barleft.value;
}, 10);
</script>
<template>
  <node-view-wrapper>
    <div
      class="progress-container"
      @mousemove="moveState ? moveProgress($event) : null"
      @mousedown="moveState = true"
      @mouseup="moveState = false"
      @mouseClick="moveProgress($event)"
    >
      <div class="progress" ref="progressRef">
        <el-progress
          :percentage="percent"
          :text-inside="true"
          :stroke-width="16"
          :color="'#16ab78'"
        />
        <!-- <div
        class="progress-box"
        @mousedown="test"
        ref="barRef"
        :style="{ left: barleft + 'px' }"
      ></div> -->
      </div>
    </div>
  </node-view-wrapper>
</template>
<style scoped lang="scss">
.progress-container {
  width: 100%;
  height: 20px;
  position: relative;
  z-index: 1;
  margin-top: 30px;
  cursor: pointer;
  padding-right: 10px;
  box-sizing: border-box;
}
</style>
<style lang="scss">
.progress-container {
  .el-progress-bar__inner {
    transition: none !important;
  }
}
</style>
