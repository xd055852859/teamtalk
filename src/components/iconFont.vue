<script setup lang="ts">
import { useStore } from "@/store";
const props = defineProps<{ name: string }>();
const store = useStore();
const dark = computed(() => store.state.common.dark);
</script>
<template>
  <i
    class="iconfont"
    :class="`icon-${props.name}`"
    style="color: var(--talk-font-color); font-size: props.size + 'px'"
  ></i>
</template>
<style scoped lang="scss"></style>
<style></style>
