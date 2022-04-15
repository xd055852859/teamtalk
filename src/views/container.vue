<script setup lang="ts">
import { ArrowDown, CaretBottom } from "@element-plus/icons-vue";
import Contact from "./contact.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import Editor from "@/components/editor/editor.vue";
import EditorNav from "@/components/editor/editorNav.vue";
import MessageItem from "@/components/messageItem.vue";
// import fullScreenSvg from "../assets/svg/fullScreen.svg";
import moreSvg from "../assets/svg/more.svg";
import Tbutton from "@/components/tbutton.vue";

const store = useStore();
const router = useRouter();
const talker = computed(() => store.state.message.talker);
const messageList = computed(() => store.state.message.messageList);
const pageNumber = computed(() => store.state.message.pageNumber);
const editorInfo = computed(() => store.state.message.editorInfo);
const page = computed(() => store.state.message.page);

const editorRef = ref(null);
const inputVisible = ref<boolean>(false);
const groupVisible = ref<boolean>(false);
const groupHeight = ref<number>(0);

onMounted(() => {
  store.dispatch("message/getMessageList", 1);
});

const postContent = async () => {
  if (talker.value && editorRef.value) {
    //@ts-ignore
    editorRef.value.handlePost(talker.value._key, (res) => {
      // store.commit("message/updateMessageList", res.data);
      inputVisible.value = false;
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
// const toInfo = () => {
//   //@ts-ignore
//   editorRef.value.toInfo();
// };
// TODO
// filter: unset;
// transition: filter .2s;
</script>
<template>
  <div class="talk-container p-5" @scroll="scrollLoading">
    <div class="talk-edit">
      <div class="top dp-space-center">
        <div class="left dp--center" @click="groupVisible = true">
          <span>{{ $t(`surface.to`) }} : </span>
          <el-avatar
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
          <editor :init-data="null" ref="editorRef" :isEdit="true" />
        </div>
        <div class="bottom dp-space-center">
          <editor-nav :editor="editorInfo" v-if="editorInfo" />
          <tbutton @click="postContent">{{ $t(`surface.Post`) }}</tbutton>
        </div>
      </div>
    </div>
    <!-- </div> -->
    <template v-for="(item, index) in messageList" :key="'chat' + index">
      <message-item :item="item" />
    </template>
  </div>

  <el-drawer
    v-model="inputVisible"
    direction="btt"
    :with-header="false"
    :size="430"
    custom-class="radius-drawer"
    destroy-on-close
  >
  </el-drawer>
  <el-drawer
    v-model="groupVisible"
    direction="ltr"
    :with-header="false"
    :size="350"
    modal-class="modal-transparent"
    custom-class="p0-drawer"
  >
    <contact @close="groupVisible = false" />
  </el-drawer>
</template>
<style scoped lang="scss">
.talk-container {
  width: 100%;
  height: calc(100vh - 55px);
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--talk-bg-color);
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
}
</style>
<style></style>
