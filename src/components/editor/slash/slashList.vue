<script setup lang="ts">
import { ElMessage } from "element-plus";
const props = defineProps<{
  items: any;
  command: Function;
}>();
const selectedIndex = ref<number>(0);
const onKeyDown = ({ event }) => {
  if (event.key === "ArrowUp") {
    upHandler();
    return true;
  }

  if (event.key === "ArrowDown") {
    downHandler();
    return true;
  }

  if (event.key === "Enter") {
    enterHandler();
    return true;
  }

  return false;
};

const upHandler = () => {
  selectedIndex.value =
    (selectedIndex.value + props.items.length - 1) % props.items.length;
};

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
};

const enterHandler = () => {
  selectItem(selectedIndex.value);
};

const selectItem = (index) => {
  const item = props.items[index];

  if (item) {
    props.command(item);
  }
};
watch(
  () => props.items,
  () => {
    selectedIndex.value = 0;
  }
);
</script>
<template>
  <div class="items">
    <div
      class="item dp-space-center"
      v-for="(item, index) in props.items"
      :key="'tab' + index"
      @click="selectItem(index)"
    >
      <img :src="item.icon" alt="" class="img" />
      <div class="title">{{ item.title }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.items {
  width: 120px;
  position: relative;
  border-radius: 10px;

  color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.item {
  width: 100%;
  height: 40px;
  padding: 0px 10px;
  box-sizing: border-box;
  background: #fff;
  .img {
    width: 18px;
    height: 18px;
  }
  .title {
    color: #9c9c9c;
    font-size: 14px;
  }
  &:hover {
    background-color: rgb(200, 196, 196);
  }
}
</style>
<style lang="scss"></style>
