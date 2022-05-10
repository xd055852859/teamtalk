<script setup lang="ts">
import { useStore } from "@/store";
import IconFont from "@/components/iconFont.vue";

const store = useStore();
const props = defineProps<{
  itemObj: { [key: string]: string | number };
  itemHeight: number;
}>();
const emits = defineEmits(["close", "chooseReceiver"]);

const editorInfo = computed(() => store.state.message.editorInfo);

const insertNode = (type) => {
  switch (type) {
    case "progress":
      editorInfo.value?.chain().setProgress().focus().run();
      break;
    case "text":
      editorInfo.value?.chain().focus().run();
      break;
    case "h1":
      editorInfo.value?.chain().setHeading({ level: 2 }).focus().run();
      break;
    case "h2":
      editorInfo.value?.chain().setHeading({ level: 3 }).focus().run();
      break;
    case "h3":
      editorInfo.value?.chain().setHeading({ level: 4 }).focus().run();
      break;
    case "divider":
      editorInfo.value?.chain().setHorizontalRule().focus().run();
      break;
    case "bulletList":
      editorInfo.value?.chain().toggleBulletList().focus().run();
      break;
    case "orderList":
      editorInfo.value?.chain().toggleOrderedList().focus().run();
      break;
    case "taskList":
      editorInfo.value?.chain().toggleTaskList().focus().run();
      break;
    case "blockquote":
      editorInfo.value?.chain().setBlockquote().focus().run();
      break;
    case "code":
      editorInfo.value?.chain().setCode().focus().run();
      break;
    case "codeBlock":
      editorInfo.value?.chain().setCodeBlock().focus().run();
      break;
  }
  emits("close");
};
</script>
<template>
  <div
    class="block-item"
    :style="{ ...props.itemObj, height: itemHeight * 11 + 'px' }"
  >
    <div
      @click="insertNode('text')"
      :style="itemHeight + 'px' ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="text" />
      Text
    </div>
    <div
      @click="insertNode('h1')"
      :style="itemHeight + 'px' ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="h1" />
      Heading1
    </div>
    <div
      @click="insertNode('h2')"
      :style="itemHeight + 'px' ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="h2" />Heading2
    </div>
    <div
      @click="insertNode('h3')"
      :style="itemHeight + 'px' ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="h3" />Heading3
    </div>
    <div
      @click="insertNode('progress')"
      :style="itemHeight + 'px' ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="progress" />
      Progress
    </div>
    <!-- <div>Card</div> -->
    <div
      @click="insertNode('bulletList')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="bulletList" />Bulleted list
    </div>
    <div
      @click="insertNode('orderList')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="orderList" />Numbered list
    </div>
    <div
      @click="insertNode('taskList')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="taskList" />To-do list
    </div>
    <!-- <div>Image</div> -->
    <div
      @click="insertNode('divider')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="divider" /> Divider
    </div>
    <div
      @click="insertNode('blockquote')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="blockquote" />Quoto
    </div>
    <div
      @click="insertNode('code')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="code" />Code
    </div>
    <div
      @click="insertNode('codeBlock')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <icon-font name="codeBlock" />Code block
    </div>
    <!-- <div>Math block</div> -->
  </div>
</template>
<style scoped lang="scss">
.block-item {
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--talk-bg-color);
  div {
    width: 100%;
    height: 50px;
    padding: 0px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      margin-right: 15px;
    }
    &:hover {
      background-color: #c9c9c9;
    }
  }
}
</style>
<style></style>
