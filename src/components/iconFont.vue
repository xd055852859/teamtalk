<script setup lang="ts">
import { useStore } from "@/store";
interface iconProps {
  name: string;
  size?: number;
  color?: string;
  hover?: boolean;
}
const props = withDefaults(defineProps<iconProps>(), {
  name: "",
  size: 20,
});
const store = useStore();
const dark = computed(() => store.state.common.dark);
</script>
<template>
  <div
    class="icon dp-center-center"
    :class="
      !hover
        ? {}
        : {
            'icon-hover-black': dark ? true : false,
            'icon-hover': dark ? false : true,
          }
    "
    :style="
      !hover
        ? { width: props.size + 'px', height: props.size + 'px' }
        : {
            width: props.size + 15 + 'px',
            height: props.size + 15 + 'px',
            // opacity: dark ? 0.52 : 0.27,
          }
    "
  >
    <i
      class="iconfont"
      :class="`icon-${props.name}`"
      :style="{
        fontSize: props.size + 'px',
        color: color ? color : 'var(--talk-font-color)',
      }"
    ></i>
  </div>
</template>
<style scoped lang="scss">
.icon {
  // opacity: 0.52;
  border-radius: 50%;
  background-color: transparent;
}
.icon-hover {
  &:hover {
    background-color: rgba(113, 113, 113, 0.27);
  }
}
.icon-hover-black {
  &:hover {
    background-color: rgba(113, 113, 113, 0.52);
  }
}
</style>
<style></style>
