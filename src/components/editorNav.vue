<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import { uploadImage } from "@/services/util";

import { useStore } from "@/store";
import leftSvg from "../assets/editor/left.svg";
import rightSvg from "../assets/editor/right.svg";
import addSvg from "../assets/editor/add.svg";
import imgSvg from "../assets/editor/img.svg";
import delSvg from "../assets/editor/del.svg";
import redoSvg from "../assets/editor/redo.svg";
import undoSvg from "../assets/editor/undo.svg";

import addwSvg from "../assets/editor/addw.svg";
import imgwSvg from "../assets/editor/imgw.svg";
import delwSvg from "../assets/editor/delw.svg";
import redowSvg from "../assets/editor/redow.svg";
import undowSvg from "../assets/editor/undow.svg";
import EditorItem from "./editorItem.vue";

const store = useStore();
const props = defineProps<{ editor: Editor }>();
const dark = computed(() => store.state.common.dark);
const uploadToken = computed(() => store.state.auth.uploadToken);

const drawer = ref<boolean>(false);
const chooseImg = (e) => {
  console.log(e.target.files[0]);
  let mimeType = ["image/png", "image/jpeg"];
  uploadImage(e.target.files[0], uploadToken.value, mimeType, (url: string) => {
    props.editor.commands.setImage({ src: url });
  });
};
</script>
<template>
  <div class="button dp--center">
    <img :src="dark ? addwSvg : addSvg" alt="" @click="drawer = true" />
    <!-- <img :src="leftSvg" alt=""  @click="props.editor.chain().focus()."/>
    <img :src="rightSvg" alt=""  @click="props.editor.chain().focus().joinForward().run()" /> -->
    <el-divider direction="vertical" />
    <div class="img-box">
      <img :src="dark ? imgwSvg : imgSvg" alt="" />
      <input
        type="file"
        accept="image/*"
        @change="chooseImg"
        class="upload-img"
      />
    </div>
    <img
      :src="dark ? delwSvg : delSvg"
      alt=""
      @click="
        props.editor.chain().focus().clearNodes().run();
        props.editor.chain().focus().clearContent().run();
      "
    />
    <el-divider direction="vertical" />
    <img
      :src="dark ? redowSvg : redoSvg"
      alt=""
      @click="props.editor.chain().focus().undo().run()"
    />
    <img
      :src="dark ? undowSvg : undoSvg"
      alt=""
      @click="props.editor.chain().focus().redo().run()"
    />
  </div>
  <el-drawer v-model="drawer" title="basicblocks" direction="btt" size="100%">
    <editor-item
      :editor="editor"
      @close="drawer = false"
      :itemObj="{ height: 'calc(100% - 50px)', width: '100vw' }"
    />
  </el-drawer>
  <!-- <button
    @click="props.editor.chain().focus().toggleBold().run()"
    :class="{ 'is-active': editor.isActive('bold') }"
  >
    bold
  </button>
  <button
    @click="props.editor.chain().focus().toggleItalic().run()"
    :class="{ 'is-active': editor.isActive('italic') }"
  >
    italic
  </button>
  <button
    @click="props.editor.chain().focus().toggleStrike().run()"
    :class="{ 'is-active': editor.isActive('strike') }"
  >
    strike
  </button>
  <button
    @click="props.editor.chain().focus().toggleCode().run()"
    :class="{ 'is-active': editor.isActive('code') }"
  >
    code
  </button>
  <button @click="props.editor.chain().focus().unsetAllMarks().run()">
    clear marks
  </button>
  <button @click="props.editor.chain().focus().clearNodes().run()">
    clear nodes
  </button>
  <button
    @click="props.editor.chain().focus().setParagraph().run()"
    :class="{ 'is-active': props.editor.isActive('paragraph') }"
  >
    paragraph
  </button>
  <button
    @click="props.editor.chain().focus().toggleHeading({ level: 1 }).run()"
    :class="{ 'is-active': props.editor.isActive('heading', { level: 1 }) }"
  >
    h1
  </button>
  <button
    @click="props.editor.chain().focus().toggleHeading({ level: 2 }).run()"
    :class="{ 'is-active': props.editor.isActive('heading', { level: 2 }) }"
  >
    h2
  </button>
  <button
    @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
    :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
  >
    h3
  </button>
  <button
    @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
    :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
  >
    h4
  </button>
  <button
    @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
    :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
  >
    h5
  </button>
  <button
    @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
    :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
  >
    h6
  </button>
  <button
    @click="editor.chain().focus().toggleBulletList().run()"
    :class="{ 'is-active': editor.isActive('bulletList') }"
  >
    bullet list
  </button>
  <button
    @click="editor.chain().focus().toggleOrderedList().run()"
    :class="{ 'is-active': editor.isActive('orderedList') }"
  >
    ordered list
  </button>
  <button
    @click="editor.chain().focus().toggleCodeBlock().run()"
    :class="{ 'is-active': editor.isActive('codeBlock') }"
  >
    code block
  </button>
  <button
    @click="editor.chain().focus().toggleBlockquote().run()"
    :class="{ 'is-active': editor.isActive('blockquote') }"
  >
    blockquote
  </button>
  <button @click="editor.chain().focus().setHorizontalRule().run()">
    horizontal rule
  </button>
  <button @click="editor.chain().focus().setHardBreak().run()">
    hard break
  </button>
  <button @click="editor.chain().focus().undo().run()">undo</button>
  <button @click="editor.chain().focus().redo().run()">redo</button> -->
</template>
<style scoped lang="scss">
.button {
  img {
    width: 20px;
    height: 20px;
    margin: 0px 8px;
    cursor: pointer;
  }
  .img-box {
    width: 20px;
    height: 20px;
    position: relative;
    z-index: 1;
    margin: 0px 8px;
    img {
      margin: 0px;
    }
    .upload-img {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 5;
      overflow: hidden;
      opacity: 0;
      cursor: pointer;
    }
  }
}
</style>
<style></style>
