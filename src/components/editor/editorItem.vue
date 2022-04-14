<script setup lang="ts">
import { useStore } from "@/store";

import textSvg from "@/assets/editor/text.svg";
import h1Svg from "@/assets/editor/h1.svg";
import h2Svg from "@/assets/editor/h2.svg";
import h3Svg from "@/assets/editor/h3.svg";
import bulletListSvg from "@/assets/editor/bulletList.svg";
import dividerSvg from "@/assets/editor/divider.svg";
import orderListSvg from "@/assets/editor/orderList.svg";
import taskListSvg from "@/assets/editor/taskList.svg";
import codeSvg from "@/assets/editor/code.svg";
import blockquoteSvg from "@/assets/editor/blockquote.svg";
import codeBlockSvg from "@/assets/editor/codeBlock.svg";
import textwSvg from "@/assets/editor/textw.svg";
import h1wSvg from "@/assets/editor/h1w.svg";
import h2wSvg from "@/assets/editor/h2w.svg";
import h3wSvg from "@/assets/editor/h3w.svg";
import bulletListwSvg from "@/assets/editor/bulletListw.svg";
import dividerwSvg from "@/assets/editor/dividerw.svg";
import orderListwSvg from "@/assets/editor/orderListw.svg";
import taskListwSvg from "@/assets/editor/taskListw.svg";
import codewSvg from "@/assets/editor/codew.svg";
import blockquotewSvg from "@/assets/editor/blockquotew.svg";
import codeBlockwSvg from "@/assets/editor/codeBlockw.svg";

const store = useStore();
const props = defineProps<{
  itemObj: { [key: string]: string | number };
  itemHeight: number;
}>();
const emits = defineEmits(["close", "chooseReceiver"]);
const editorInfo = computed(() => store.state.message.editorInfo);
const dark = computed(() => store.state.common.dark);

const html: any = {
  type: "paragraph",
};
const insertNode = (type) => {
  switch (type) {
    case "text":
      editorInfo.value?.chain().focus().run();
      break;
    case "h1":
      editorInfo.value?.chain().setHeading({ level: 1 }).focus().run();
      break;
    case "h2":
      editorInfo.value?.chain().setHeading({ level: 2 }).focus().run();
      break;
    case "h3":
      editorInfo.value?.chain().setHeading({ level: 3 }).focus().run();
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
    :style="{ ...props.itemObj, height: itemHeight * 11 + 30 + 'px' }"
  >
    <div
      @click="insertNode('text')"
      :style="itemHeight + 'px' ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? textwSvg : textSvg" alt="" />Text
    </div>
    <div
      @click="insertNode('h1')"
      :style="itemHeight + 'px' ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? h1wSvg : h1Svg" alt="" />Heading1
    </div>
    <div
      @click="insertNode('h2')"
      :style="itemHeight + 'px' ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? h2wSvg : h2Svg" alt="" />Heading2
    </div>
    <div
      @click="insertNode('h3')"
      :style="itemHeight + 'px' ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? h3wSvg : h3Svg" alt="" />Heading3
    </div>
    <!-- <div>Card</div> -->
    <div
      @click="insertNode('bulletList')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? bulletListwSvg : bulletListSvg" alt="" />Bulleted list
    </div>
    <div
      @click="insertNode('orderList')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? orderListwSvg : orderListSvg" alt="" />Numbered list
    </div>
    <div
      @click="insertNode('taskList')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? taskListwSvg : taskListSvg" alt="" />To-do list
    </div>
    <!-- <div>Image</div> -->
    <div
      @click="insertNode('divider')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? dividerwSvg : dividerSvg" alt="" /> Divider
    </div>
    <div
      @click="insertNode('blockquote')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? blockquotewSvg : blockquoteSvg" alt="" />Quoto
    </div>
    <div
      @click="insertNode('code')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? codewSvg : codeSvg" alt="" />Code
    </div>
    <div
      @click="insertNode('codeBlock')"
      :style="itemHeight ? { height: itemHeight + 'px' } : {}"
    >
      <img :src="dark ? codeBlockwSvg : codeBlockSvg" alt="" />Code block
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
    line-height: 50px;
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      margin-right: 15px;
    }
    :hover {
      background-color: #c9c9c9;
    }
  }
}
</style>
<style></style>
