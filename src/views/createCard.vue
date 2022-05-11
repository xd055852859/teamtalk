<script setup lang="ts">
import EditorNav from "@/components/editor/editorNav.vue";
import Editor from "../components/editor/editor.vue";

import { useStore } from "@/store";
import { getSearchParamValue } from "@/services/util";

const talkKey = computed(() => store.state.message.talkKey);
const editorInfo = computed(() => store.state.message.editorInfo);
const dark = computed(() => store.state.common.dark);

const store = useStore();
const editorRef = ref(null);
const userState = ref<boolean>(false);
const shakeState = ref<boolean>(false);
onMounted(() => {
  const search = window.location.search
    ? window.location.search.split("?")[1]
    : window.location.hash.split("?")[1];
  userState.value = (getSearchParamValue(search, "receiverType") as string)
    ? true
    : false;
});
const postContent = async () => {
  if (talkKey.value && editorRef.value) {
    //@ts-ignore
    editorRef.value.handlePost(talkKey.value, () => {
      shakeState.value = false;
    });
  }
};
</script>
<template>
  <div class="info p-5">
    <editor
      :init-data="null"
      :isEdit="true"
      ref="editorRef"
      :shake="shakeState"
    />
  </div>

  <div class="footer dp-space-center p-5">
    <editor-nav :editor="editorInfo" v-if="editorInfo" />
    <div class="button dp--center">
      <template v-if="userState">
        <el-tooltip :content="$t(`icon.Shake`)">
          <icon-font
            :name="shakeState ? 'shake' : 'unshake'"
            class="icon-point"
            style="margin-right: 10px"
            :size="25"
            :color="shakeState ? '#16ab78' : ''"
            @click="shakeState = true"
          />
        </el-tooltip>
      </template>
      <tbutton class="button" @click="postContent" v-if="talkKey">{{
        $t(`button.Send`)
      }}</tbutton>
    </div>
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
