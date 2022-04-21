<script setup lang="ts">
import { ArrowDown, CaretBottom } from "@element-plus/icons-vue";
import Contact from "./contact.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import Editor from "@/components/editor/editor.vue";
import Tbutton from "@/components/tbutton.vue";
import EditorNav from "@/components/editor/editorNav.vue";
import MessageItem from "@/components/messageItem.vue";
// import fullScreenSvg from "../assets/svg/fullScreen.svg";
import toTopSvg from "../assets/svg/toTop.svg";
import unshakeSvg from "@/assets/svg/unshake.svg";
import unshakewSvg from "@/assets/svg/unshakew.svg";
import shakeSvg from "@/assets/svg/shake.svg";

const store = useStore();
const talker = computed(() => store.state.message.talker);
const messageList = computed(() => store.state.message.messageList);
const pageNumber = computed(() => store.state.message.pageNumber);
const editorInfo = computed(() => store.state.message.editorInfo);
const page = computed(() => store.state.message.page);
const dark = computed(() => store.state.common.dark);

const talkRef = ref(null);
const editorRef = ref(null);
const talkVisible = ref<boolean>(false);
const topVisible = ref<boolean>(false);
const shakeState = ref<boolean>(false);
onMounted(() => {
  store.dispatch("message/getMessageList", 1);
});

const postContent = async () => {
  if (talker.value && editorRef.value) {
    //@ts-ignore
    editorRef.value.handlePost(talker.value._key, (res) => {
      if (res.data.receiverType === "user") {
        store.commit("message/addMessageList", res.data);
        shakeState.value = false;
      }
    });
  } else {
    ElMessage.error("choose a receiver");
    return;
  }
};

const scrollLoading = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let clientHeight = e.target.clientHeight;
  topVisible.value = scrollTop > clientHeight ? true : false;
  if (
    clientHeight + scrollTop >= scrollHeight &&
    page.value < pageNumber.value
  ) {
    let newPage = page.value + 1;
    store.commit("message/setPage", newPage);
    store.dispatch("message/getMessageList", newPage);
  }
};
const toTop = () => {
  topVisible.value = false;
  let timer = setInterval(function () {
    //@ts-ignore
    // 设置定时器
    //@ts-ignore
    talkRef.value.scrollTop -= 80; // 使高度每次减少20px
    //@ts-ignore
    if (talkRef.value.scrollTop <= 0) {
      clearInterval(timer); // 关闭定时器
    }
  }, 30);
};
// TODO
// filter: unset;
// transition: filter .2s;
</script>
<template>
  <div class="talk-container p-5" @scroll="scrollLoading" ref="talkRef">
    <div class="talk-edit">
      <div class="top dp-space-center">
        <div class="left dp--center icon-point" @click="talkVisible = true">
          <span>{{ $t(`surface.to`) }} : </span>
          <el-avatar
            fit="cover"
            :size="25"
            :src="talker.avatar"
            v-if="talker"
            :style="{ marginLeft: '5px' }"
          />
          <span class="m-right-10">{{ talker?.title }}</span>
          <el-icon>
            <arrow-down />
          </el-icon>
        </div>
        <div class="right dp--center">
          <!-- <img
            :src="fullScreenSvg"
            style="width: 16px; height: 16px"
            alt=""
            @click="toInfo()"
          /> -->
          <!-- <img :src="moreSvg" alt="" style="width: 16px; height: 3px" /> -->
        </div>
      </div>
      <!-- <el-divider /> -->
      <div class="center">
        <div class="editor">
          <editor
            :init-data="null"
            ref="editorRef"
            :isEdit="true"
            :shake="shakeState"
          />
        </div>
        <div class="bottom dp-space-center">
          <editor-nav :editor="editorInfo" v-if="editorInfo" />
          <div class="bottom dp--center">
            <template v-if="talker?.receiverType === 'user'">
              <img
                :src="shakeSvg"
                alt=""
                v-if="shakeState"
                class="icon-point"
                style="width: 25px; height: 25px; margin-right: 10px"
              />
              <img
                :src="dark ? unshakewSvg : unshakeSvg"
                alt=""
                v-else
                class="icon-point"
                @click="shakeState = true"
                style="width: 25px; height: 25px; margin-right: 10px"
              />
            </template>
            <tbutton @click="postContent">{{ $t(`surface.Post`) }}</tbutton>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
    <template v-for="(item, index) in messageList" :key="'chat' + index">
      <message-item :item="item" />
    </template>
    <div class="toTop icon-point" v-if="topVisible" @click="toTop">
      <img :src="toTopSvg" alt="" style="width: 50px; height: 50px" />
    </div>
  </div>

  <el-drawer
    v-model="talkVisible"
    direction="ltr"
    :with-header="false"
    :size="'80%'"
    custom-class="p0-drawer"
    destroy-on-close
  >
    <contact @close="talkVisible = false"></contact>
  </el-drawer>
</template>
<style scoped lang="scss">
.talk-container {
  width: 100%;
  height: calc(100vh - 55px);
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--talk-bg-color);
  position: relative;
  z-index: 1;
  .talk-edit {
    width: 100%;
    min-height: 200px;
    background-color: var(--talk-item-color);
    border: 2px solid rgba(30, 30, 30, 1);
    border-radius: 8px;
    padding: 10px 22px;
    box-sizing: border-box;
    .top {
      width: 100%;
      height: 30px;
      .left {
        height: 100%;
      }
      .right {
        height: 100%;
      }
    }
    .center {
      width: 100%;
      min-height: 220px;
      position: relative;
      z-index: 1;
      overflow: hidden;
      // border: 1px solid #c8c8c8;
      // border-radius: 8px;
      .editor {
        width: 100%;
        min-height: 185px;
        overflow: auto;
        position: relative;
        z-index: 1;
        padding: 0px 5px;
        box-sizing: border-box;
      }
      .bottom {
        height: 30px;
        .button {
          img {
            width: 20px;
            height: 20px;
            margin-right: 15px;
          }
        }
      }
    }
  }
  .toTop {
    position: fixed;
    z-index: 5;
    right: 20px;
    bottom: 40px;
  }
}
</style>
<style></style>
