<script setup lang="ts">
import { ArrowDown, CaretBottom } from "@element-plus/icons-vue";
import Contact from "./contact.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import Editor from "@/components/editor.vue";

import MessageItem from "@/components/messageItem.vue";
import fullScreenSvg from "../assets/svg/fullScreen.svg";
import moreSvg from "../assets/svg/more.svg";

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
const postMessage = async () => {
  if (!content.value) {
    ElMessage.error("choose a receiver");
    return;
  }
  const postRes = (await api.request.post("card", {
    receiverKey: talker.value?._key,
    title: "新消息",
    detail: [
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "新消息" }],
      },
      { type: "paragraph", content: [{ type: "text", text: content.value }] },
    ],
    summary: content.value.substring(0, 200),
    cover: "",
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage.success("submit success");
    store.commit("message/updateMessageList", postRes.data);
  }
};
const showDrawer = () => {
  inputVisible.value = true;
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
const toInfo = () => {
  //@ts-ignore
  editorRef.value.toInfo();
};
</script>
<template>
  <div class="talk-top p-5 dp-center-center">
    <!-- <div class="input dp-space-center"> -->
    <el-input
      v-model="content"
      :placeholder="`${$t(`surface['Talk with']`)} : ${
        talker ? talker.title : 'all'
      }`"
      size="large"
      @change="postMessage"
    >
      <template #append>
        <el-icon @click="showDrawer" :size="23"><caret-bottom /></el-icon>
      </template>
    </el-input>
    <!-- <el-input
        v-model="content"
        :placeholder="`${$t(`surface['Talk with']`)} : ${
          talker ? talker.title : 'all'
        }`"
        @change="postMessage"
      />
      <div class="right dp-center-center">
       
      </div> -->
  </div>
  <!-- </div> -->
  <div class="talk-bottom p-5" @scroll="scrollLoading">
    <div class="box" v-for="(item, index) in messageList" :key="'chat' + index">
      <message-item :item="item" />
    </div>
  </div>

  <el-drawer
    v-model="inputVisible"
    direction="btt"
    :with-header="false"
    :size="430"
    custom-class="radius-drawer"
    destroy-on-close
  >
    <div class="talk-box p-5">
      <div class="top dp-space-center">
        <div class="left dp--center" @click="groupVisible = true">
          <span class="common-color">{{ $t(`surface['Talk with']`) }} : </span>
          <span class="m-left-10 m-right-10">{{
            talker ? talker.title : "all"
          }}</span>
          <el-icon>
            <arrow-down />
          </el-icon>
        </div>
        <div class="right dp--center">
          <img
            :src="fullScreenSvg"
            style="width: 16px; height: 16px; margin-right: 20px"
            alt=""
            @click="toInfo()"
          />
          <img :src="moreSvg" alt="" style="width: 16px; height: 3px" />
        </div>
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
.talk-bottom {
  width: 100%;
  height: calc(100vh - 135px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 80px;
}
.talk-top {
  width: 100%;
  height: 80px;
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
    .right {
      width: 50px;
    }
  }
}
.talk-box {
  padding-top: 15px;
  box-sizing: border-box;
  .top {
    width: 100%;
    height: 40px;
    .left {
      height: 100%;
    }
    .right {
      height: 100%;
    }
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
</style>
<style></style>
