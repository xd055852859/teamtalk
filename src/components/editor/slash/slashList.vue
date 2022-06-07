<script setup lang="ts">
import { uploadImage } from "@/services/util";
import { useStore } from "@/store";
import IconFont from "@/components/iconFont.vue";

const store = useStore();
const props = defineProps<{
  items: any;
  command: Function;
}>();
const uploadToken = computed(() => store.state.auth.uploadToken);
const editorInfo = computed(() => store.state.message.editorInfo);
const dark = computed(() => store.state.common.dark);

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
const chooseImg = (e, index: number) => {
  let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
  uploadImage(e.target.files[0], uploadToken.value, mimeType, (url: string) => {
    props.items[index].props = { url: url };
    console.log(props.items[index]);
    props.command(props.items[index]);
    // editorInfo.value?.chain().focus().deleteRange(range).setImage({ src: url });
  });
};
watch(
  () => props.items,
  () => {
    selectedIndex.value = 0;
  }
);
defineExpose({
  onKeyDown,
});
</script>
<template>
  <div class="items">
    <div
      class="item dp-space-center"
      v-for="(item, index) in props.items"
      :key="'tab' + index"
      @click="item.title !== 'img' ? selectItem(index) : ''"
      :style="
        selectedIndex === index
          ? { backgroundColor: 'var(--talk-hover-color)' }
          : ''
      "
    >
      <template v-if="item.title !== 'img'">
        <icon-font :name="item.title" />
        <div class="title">{{ item.title }}</div>
      </template>
      <template v-else>
        <input
          type="file"
          accept="image/*"
          @change="chooseImg($event, index)"
          class="upload-img"
        />
        <icon-font name="image" />
        <div class="title">{{ item.title }}</div>
      </template>
    </div>
  </div>
</template>
<style scoped lang="scss">
.items {
  width: 200px;
  position: relative;
  border-radius: 10px;
  background-color: var(--talk-bg-color);
  color: var(--talk-font-color);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.item {
  width: 100%;
  height: 40px;
  padding: 0px 10px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  .img {
    width: 18px;
    height: 18px;
  }
  .title {
    color: #9c9c9c;
    font-size: 14px;
  }
  &:hover {
    background-color: val(--talk-hover-color);
  }
  .upload-img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 5;
    overflow: hidden;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
<style lang="scss"></style>
