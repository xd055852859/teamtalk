<script setup lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";
import Contact from "./contact.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import Editor from "@/components/editor.vue";

import addSvg from "../assets/svg/add.svg";
import linkSvg from "../assets/svg/link.svg";
import imgSvg from "../assets/svg/img.svg";
import shapeSvg from "../assets/svg/shape.svg";
import MessageItem from "@/components/messageItem.vue";

const store = useStore();
const router = useRouter();
const talker = computed(() => store.state.message.talker);
const messageList = computed(() => store.state.message.messageList);
const pageNumber = computed(() => store.state.message.pageNumber);
const page = computed(() => store.state.message.page);

const editorRef = ref(null);
const inputVisible = ref<boolean>(false);
const groupVisible = ref<boolean>(false);
const groupHeight = ref<number>(0);
const content = ref<string>("");
onMounted(() => {
  groupHeight.value = document.documentElement.offsetHeight - 55;
  store.dispatch("message/getMessageList", 1);
});

const postContent = async () => {
  if (talker.value && editorRef.value) {
    //@ts-ignore
    editorRef.value.handlePost(talker.value._key, (res) => {
      store.commit("message/updateMessageList", res.data);
      inputVisible.value = false;
    });
  } else {
    ElMessage.error("choose a receiver");
    return;
  }
};

const closeInput = (done: () => void) => {
  content.value = "";
  done();
};
const scrollLoading = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let clientHeight = e.target.clientHeight;
  console.log(page.value, pageNumber.value);
  if (
    clientHeight + scrollTop >= scrollHeight &&
    page.value < pageNumber.value
  ) {
    let newPage = page.value + 1;
    store.commit("message/setPage", newPage);
    store.dispatch("message/getMessageList", newPage);
  }
};
</script>
<template>
  <div class="talk-top p-5" @scroll="scrollLoading">
    <div class="box" v-for="(item, index) in messageList" :key="'chat' + index">
      <message-item :item="item" />
    </div>
  </div>
  <div class="talk-bottom p-5 dp-center-center">
    <div class="input" @click="inputVisible = true">
      {{ $t(`surface['Talk with']`) }} : {{ talker ? talker.title : "all" }}
    </div>
  </div>
  <el-drawer
    v-model="inputVisible"
    direction="btt"
    :with-header="false"
    :size="430"
    custom-class="radius-drawer"
    :before-close="closeInput"
    destroy-on-close
  >
    <div class="talk-box">
      <div class="top p-5">
        <div class="title dp--center" @click="groupVisible = true">
          <span class="common-color">{{ $t(`surface['Talk with']`) }} : </span>
          <span class="m-left-10 m-right-10">{{
            talker ? talker.title : "all"
          }}</span>
          <el-icon>
            <arrow-down />
          </el-icon>
        </div>
        <el-divider />
        <div class="center">
          <div class="editor">
            <editor
              :init-data="null"
              ref="editorRef"
              :isEdit="true"
              position="bottom"
            />
          </div>

          <div class="bottom dp-space-center">
            <el-button type="primary" round @click="postContent">{{
              $t(`surface.Post`)
            }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
  <el-drawer
    v-model="groupVisible"
    direction="btt"
    :with-header="false"
    :size="groupHeight"
    modal-class="modal-transparent"
    custom-class="radius-drawer"
  >
    <contact @close="groupVisible = false" />
  </el-drawer>
</template>
<style scoped lang="scss">
.talk-top {
  width: 100%;
  height: calc(100vh - 55px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 80px;
}
.talk-bottom {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0px;
  bottom: 0px;
  z-index: 2;
  background: var(--talk-bg-color);
  .input {
    width: 100%;
    height: 40px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    line-height: 40px;
    padding: 0px 10px;
    box-sizing: border-box;
    font-weight: 400;
    text-align: left;
    color: #999999;
  }
}
.talk-box {
  padding-top: 15px;
  box-sizing: border-box;
  .top {
    width: 100%;
    height: 350px;
    margin-bottom: 10px;
    .title {
      height: 40px;
    }
    .center {
      width: 100%;
      height: 340px;
      position: relative;
      z-index: 1;
      margin-top: 10px;
      overflow: hidden;
      .editor {
        width: 100%;
        height: 340px;
        overflow: auto;
        position: relative;
        z-index: 1;
      }
      .bottom {
        height: 30px;
        position: absolute;
        right: 10px;
        bottom: 0px;
        z-index: 10;
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
}
</style>
<style></style>
