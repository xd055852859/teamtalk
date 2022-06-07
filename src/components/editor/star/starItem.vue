<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";
import { onMounted, ref } from "vue";
const props = defineProps(nodeViewProps);
const count = ref<number>(0);
onMounted(() => {
  count.value = props?.node?.attrs.count;
});
const handleChange = (val: number) => {
  if (props.updateAttributes) {
    props.updateAttributes({
      count: val,
    });
  }
};
</script>
<template>
  <node-view-wrapper>
    <el-rate v-model="count" size="large" :max="10" @change="handleChange" />
  </node-view-wrapper>
</template>
<style scoped lang="scss"></style>
