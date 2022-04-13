<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import { useStore } from "@/store";

import textSvg from "../assets/editor/text.svg";
import h1Svg from "../assets/editor/h1.svg";
import h2Svg from "../assets/editor/h2.svg";
import h3Svg from "../assets/editor/h3.svg";
import bulletListSvg from "../assets/editor/bulletList.svg";
import dividerSvg from "../assets/editor/divider.svg";
import orderListSvg from "../assets/editor/orderList.svg";
import taskListSvg from "../assets/editor/taskList.svg";
import codeSvg from "../assets/editor/code.svg";
import blockquoteSvg from "../assets/editor/blockquote.svg";
import codeBlockSvg from "../assets/editor/codeBlock.svg";
import textwSvg from "../assets/editor/textw.svg";
import h1wSvg from "../assets/editor/h1w.svg";
import h2wSvg from "../assets/editor/h2w.svg";
import h3wSvg from "../assets/editor/h3w.svg";
import bulletListwSvg from "../assets/editor/bulletListw.svg";
import dividerwSvg from "../assets/editor/dividerw.svg";
import orderListwSvg from "../assets/editor/orderListw.svg";
import taskListwSvg from "../assets/editor/taskListw.svg";
import codewSvg from "../assets/editor/codew.svg";
import blockquotewSvg from "../assets/editor/blockquotew.svg";
import codeBlockwSvg from "../assets/editor/codeBlockw.svg";

const store = useStore();
const props = defineProps<{
  editor: Editor;
  itemObj: { [key: string]: string | number };
}>();
const emits = defineEmits(["close", "chooseReceiver"]);

const dark = computed(() => store.state.common.dark);

const html: any = {
  type: "paragraph",
};
const insertNode = (type) => {
  switch (type) {
    case "text":
      props.editor.chain().insertContent(html).focus().run();
      break;
    case "h1":
      props.editor
        .chain()
        .insertContent(html)
        .setHeading({ level: 1 })
        .focus()
        .run();
      break;
    case "h2":
      props.editor
        .chain()
        .insertContent(html)
        .setHeading({ level: 2 })
        .focus()
        .run();
      break;
    case "h3":
      props.editor
        .chain()
        .insertContent(html)
        .setHeading({ level: 3 })
        .focus()
        .run();
      break;
    case "divider":
      props.editor
        .chain()
        .insertContent(html)
        .setHorizontalRule()
        .focus()
        .run();
      break;
    case "bulletList":
      props.editor.chain().insertContent(html).toggleBulletList().focus().run();
      break;
    case "orderList":
      props.editor
        .chain()
        .insertContent(html)
        .toggleOrderedList()
        .focus()
        .run();
      break;
    case "taskList":
      props.editor.chain().insertContent(html).toggleTaskList().focus().run();
      break;
    case "blockquote":
      props.editor.chain().insertContent(html).setBlockquote().focus().run();
      break;
    case "code":
      props.editor.chain().insertContent(html).setCode().focus().run();
      break;
    case "codeBlock":
      props.editor.chain().insertContent(html).setCodeBlock().focus().run();
      break;
  }
  emits("close");
};
</script>
<template>
  <div class="block-item" :style="{ ...props.itemObj }">
    <div @click="insertNode('text')">
      <img :src="dark ? textwSvg : textSvg" alt="" />Text
    </div>
    <div @click="insertNode('h1')">
      <img :src="dark ? h1wSvg : h1Svg" alt="" />Heading1
    </div>
    <div @click="insertNode('h2')">
      <img :src="dark ? h2wSvg : h2Svg" alt="" />Heading2
    </div>
    <div @click="insertNode('h3')">
      <img :src="dark ? h3wSvg : h3Svg" alt="" />Heading3
    </div>
    <!-- <div>Card</div> -->
    <div @click="insertNode('bulletList')">
      <img :src="dark ? bulletListwSvg : bulletListSvg" alt="" />Bulleted list
    </div>
    <div @click="insertNode('orderList')">
      <img :src="dark ? orderListwSvg : orderListSvg" alt="" />Numbered list
    </div>
    <div @click="insertNode('taskList')">
      <img :src="dark ? taskListwSvg : taskListSvg" alt="" />To-do list
    </div>
    <!-- <div>Image</div> -->
    <div @click="insertNode('divider')">
      <img :src="dark ? dividerwSvg : dividerSvg" alt="" /> Divider
    </div>
    <div @click="insertNode('blockquote')">
      <img :src="dark ? blockquotewSvg : blockquoteSvg" alt="" />Quoto
    </div>
    <div @click="insertNode('code')">
      <img :src="dark ? codewSvg : codeSvg" alt="" />Code
    </div>
    <div @click="insertNode('codeBlock')">
      <img :src="dark ? codeBlockwSvg : codeBlockSvg" alt="" />Code block
    </div>
    <!-- <div>Math block</div> -->
  </div>
</template>
<style scoped lang="scss">
.block-item {
  overflow-y: auto;
  overflow-x: hidden;
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
