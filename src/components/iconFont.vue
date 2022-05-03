<script setup lang="ts">
import { useStore } from "@/store";
interface iconProps {
  name: string;
  size?: number;
  color?: string;
}
const props = withDefaults(defineProps<iconProps>(), {
  name: "",
  size: 20,
});
const store = useStore();
const dark = computed(() => store.state.common.dark);
</script>
<template>
  <i
    class="iconfont"
    :class="`icon-${props.name}`"
    :style="{
      fontSize: props.size + 'px',
      color: color ? color : 'var(--talk-font-color)',
    }"
  ></i>
</template>
<style scoped lang="scss"></style>
<style></style>
