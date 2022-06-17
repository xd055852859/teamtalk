<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import { uploadImage } from "@/services/util";
import EditorItem from "./editorItem.vue";
import { useStore } from "@/store";

import IconFont from "../iconFont.vue";
import { ElMessage } from "element-plus";

const store = useStore();
const dark = computed(() => store.state.common.dark);
const uploadToken = computed(() => store.state.auth.uploadToken);
const editorInfo = computed(() => store.state.message.editorInfo);

const drawer = ref<boolean>(false);
const chooseImg = (e) => {
  let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
  let fileList = e.target.files;
  for (let index = 0; index < fileList.length; index++) {
    uploadImage(fileList[index], uploadToken.value, mimeType, (url: string) => {
      editorInfo.value
        ?.chain()
        .insertContent(`<p><img src="${url}"/></p>`)
        .run();
    });
  }
};
</script>
<template>
  <div class="button dp--center">
    <el-tooltip :content="'add'" placement="top">
      <el-dropdown>
        <icon-font name="add" />
        <template #dropdown>
          <editor-item :itemObj="{ width: '180px' }" :item-height="35" />
        </template>
      </el-dropdown>
    </el-tooltip>
    <!-- <img :src="leftSvg" alt=""  @click="props.editor.chain().focus()."/>
    <img :src="rightSvg" alt=""  @click="props.editor.chain().focus().joinForward().run()" /> -->
    <el-divider direction="vertical" />
    <el-tooltip :content="'img'" placement="top">
      <div class="img-box">
        <icon-font name="img" />
        <input
          type="file"
          accept="image/*"
          @change="chooseImg"
          class="upload-img"
          multiple
        />
      </div>
    </el-tooltip>
    <!-- <img
      :src="dark ? delwSvg : delSvg"
      alt=""
      @click="
        props.editor.chain().focus().clearNodes().run();
        props.editor.chain().focus().clearContent().run();
      "
    /> -->
    <el-divider direction="vertical" />
    <el-tooltip :content="'redo'" placement="top">
      <icon-font
        name="redo"
        @click="editorInfo?.chain().focus().undo().run()"
        style="margin-right: 15px"
      />
    </el-tooltip>
    <el-tooltip :content="'undo'" placement="top">
      <icon-font
        name="undo"
        @click="editorInfo?.chain().focus().redo().run()"
      />
    </el-tooltip>
  </div>
  <!-- <el-drawer
    v-model="drawer"
    title="basicblocks"
    direction="btt"
    size="100%"
    :append-to-body="true"
  >
    
  </el-drawer> -->
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
