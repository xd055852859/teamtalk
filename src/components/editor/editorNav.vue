<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import { uploadImage } from "@/services/util";
import EditorItem from "./editorItem.vue";
import { useStore } from "@/store";

// import leftSvg from "../assets/editor/left.svg";
// import rightSvg from "../assets/editor/right.svg";
import addSvg from "@/assets/editor/add.svg";
import imgSvg from "@/assets/editor/img.svg";
import delSvg from "@/assets/editor/del.svg";
import redoSvg from "@/assets/editor/redo.svg";
import undoSvg from "@/assets/editor/undo.svg";

import addwSvg from "@/assets/editor/addw.svg";
import imgwSvg from "@/assets/editor/imgw.svg";
import delwSvg from "@/assets/editor/delw.svg";
import redowSvg from "@/assets/editor/redow.svg";
import undowSvg from "@/assets/editor/undow.svg";

const store = useStore();
const dark = computed(() => store.state.common.dark);
const uploadToken = computed(() => store.state.auth.uploadToken);
const editorInfo = computed(() => store.state.message.editorInfo);

const drawer = ref<boolean>(false);
const chooseImg = (e) => {
  console.log(e.target.files[0]);
  let mimeType = ["image/png", "image/jpeg"];
  uploadImage(e.target.files[0], uploadToken.value, mimeType, (url: string) => {
    editorInfo.value?.commands.setImage({ src: url });
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
    <!-- <img
      :src="dark ? delwSvg : delSvg"
      alt=""
      @click="
        props.editor.chain().focus().clearNodes().run();
        props.editor.chain().focus().clearContent().run();
      "
    /> -->
    <el-divider direction="vertical" />
    <img
      :src="dark ? redowSvg : redoSvg"
      alt=""
      @click="editorInfo?.chain().focus().undo().run()"
    />
    <img
      :src="dark ? undowSvg : undoSvg"
      alt=""
      @click="editorInfo?.chain().focus().redo().run()"
    />
  </div>
  <el-drawer
    v-model="drawer"
    title="basicblocks"
    direction="btt"
    size="100%"
    :append-to-body="true"
  >
    <editor-item
      @close="drawer = false"
      :itemObj="{ height: 'calc(100% - 50px)', width: '100vw' }"
      :item-height="40"
    />
  </el-drawer>
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
