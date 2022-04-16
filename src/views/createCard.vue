<script setup lang="ts">
import request from "@/services/api";
import { useStore } from "@/store";
import { Card } from "@/interface/Message";
import EditorNav from "@/components/editor/editorNav.vue";
import Editor from "../components/editor/editor.vue";
import { ElMessage } from "element-plus";
import Tbutton from "@/components/tbutton.vue";

import { getSearchParamValue } from "@/services/util";
const talkKey = computed(() => store.state.message.talkKey);
const editorInfo = computed(() => store.state.message.editorInfo);

const store = useStore();
const editorRef = ref(null);

const postContent = async () => {
  console.log(editorRef.value);
  if (talkKey.value && editorRef.value) {
    //@ts-ignore
    editorRef.value.handlePost(talkKey.value);
  } else {
    ElMessage.error("choose a receiver");
    return;
  }
};
</script>
<template>
  <div class="info p-5">
    <editor :init-data="null" :isEdit="true" ref="editorRef" />
  </div>

  <div class="footer dp-space-center p-5">
    <editor-nav :editor="editorInfo" v-if="editorInfo" />
    <tbutton class="button" @click="postContent" v-if="talkKey">{{
      $t(`surface.Post`)
    }}</tbutton>
  </div>
</template>
<style scoped lang="scss">
.info {
  width: 100%;
  height: 100vh;
  background: var(--talk-bg-color);
  padding-top: 30px;
  padding-bottom: 30px;
  box-sizing: border-box;
}
.footer {
  width: 100%;
  height: 50px;
  position: fixed;
  z-index: 2;
  left: 0px;
  bottom: 0px;
  background-color: var(--talk-item-color);
  box-sizing: border-box;
}
</style>
<style></style>
