<script setup lang="ts">
import Editor from "@/components/editor/editor.vue";
import Tbutton from "@/components/tbutton.vue";
import EditorNav from "@/components/editor/editorNav.vue";
import MessageItem from "@/components/messageItem.vue";
import Contact from "./contact.vue";

import { ArrowDown } from "@element-plus/icons-vue";
import { useStore } from "@/store";

import toTopSvg from "../assets/svg/toTop.svg";
import unshakeSvg from "@/assets/svg/unshake.svg";
import unshakewSvg from "@/assets/svg/unshakew.svg";
import shakeSvg from "@/assets/svg/shake.svg";
import Theader from "@/components/theader.vue";
import IconFont from "@/components/iconFont.vue";

const store = useStore();

const talker = computed(() => store.state.message.talker);
const messageList = computed(() => store.state.message.messageList);
const pageNumber = computed(() => store.state.message.pageNumber);
const editorInfo = computed(() => store.state.message.editorInfo);
const page = computed(() => store.state.message.page);
const dark = computed(() => store.state.common.dark);
const top = computed(() => store.state.common.top);
const user = computed(() => store.state.auth.user);

const talkRef = ref(null);
const editorRef = ref(null);
const contactRef = ref(null);

const talkVisible = ref<boolean>(false);
const topVisible = ref<boolean>(false);
const shakeState = ref<boolean>(false);
const eyeState = ref<boolean>(false);
const overKey = ref<string>("");
const loading = ref<boolean>(false);
onMounted(() => {
  //@ts-ignore
  talkRef.value.scrollTop = top.value;
});
const postContent = async () => {
  if (talker.value && editorRef.value) {
    loading.value = true;
    console.log(loading.value);
    //@ts-ignore
    editorRef.value.handlePost(talker.value._key, (res) => {
      if (res.data.creatorInfo._key === user.value?._key) {
        res.data.type = "self";
        store.commit("message/addMessageList", res.data);
        shakeState.value = false;
        console.log(loading.value);
        loading.value = false;
      }
    });
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
  store.commit("common/setTop", scrollTop);
  if (
    clientHeight + scrollTop >= scrollHeight &&
    page.value < pageNumber.value
  ) {
    let newPage = page.value + 1;
    store.commit("message/setPage", newPage);
    store.dispatch("message/getMessageList", newPage);
  }
};
// changeReceiver('receiver', item)"
const changeReceiver = (state: boolean) => {
  eyeState.value = state;
  store.commit("message/setReceiver", state ? talker.value : null);
  store.commit("message/setReceiverType", state ? "receiver" : "all");
  store.dispatch("message/getMessageList", 1);
};
const toTop = () => {
  topVisible.value = false;
  let timer = setInterval(function () {
    //@ts-ignore
    talkRef.value.scrollTop -= 80; // 使高度每次减少20px
    //@ts-ignore
    if (talkRef.value.scrollTop <= 0) {
      clearInterval(timer); // 关闭定时器
    }
  }, 30);
};
</script>
<template>
  <theader headerIcon="menu" headerTitle="Notes">
    <template v-slot:title></template>
    <template v-slot:right><div></div></template>
  </theader>
  <div
    class="talk-box p-5 dp-center-center"
    @scroll="scrollLoading"
    ref="talkRef"
  >
    <div class="talk-container">
      <div class="talk-edit">
        <div class="top dp-space-center">
          <div class="left dp--center icon-point" @click="talkVisible = true">
            <span>To : </span>
            <el-dropdown :max-height="500" trigger="click" ref="contactRef">
              <div class="dp--center">
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

              <template #dropdown>
                <contact :eyeState="eyeState"></contact>
              </template>
            </el-dropdown>
          </div>
          <div class="right">
            <el-tooltip :content="'show'" placement="top" v-if="eyeState">
              <icon-font
                name="eyeshow"
                style="margin-right: 5px"
                @click="changeReceiver(false)"
              />
            </el-tooltip>
            <el-tooltip :content="'hide'" v-else>
              <icon-font
                name="eyehide"
                style="margin-right: 5px"
                @click="changeReceiver(true)"
            /></el-tooltip>
            <el-tooltip :content="$t(`text.Setting`)">
              <icon-font
                name="set"
                @click="
                  talker
                    ? talker.receiverType === 'user'
                      ? $router.push(`/member/${talker.toUserKey}`)
                      : $router.push(`/manage/${talker._key}`)
                    : null
                "
              />
            </el-tooltip>
          </div>
        </div>
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
                <el-tooltip :content="$t(`icon.Shake`)">
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
                </el-tooltip>
              </template>
              <tbutton @click="postContent" @loading="loading">{{
                $t(`button.Send`)
              }}</tbutton>
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in messageList"
        :key="'chat' + index"
        @mouseenter="overKey = item._key"
      >
        <message-item :item="item" :overKey="overKey" />
      </div>
      <div class="toTop icon-point" v-if="topVisible" @click="toTop">
        <img :src="toTopSvg" alt="" style="width: 50px; height: 50px" />
      </div>
    </div>
  </div>

  <!-- <el-drawer
    v-model="talkVisible"
    direction="ltr"
    :with-header="false"
    :size="'80%'"
    custom-class="p0-drawer"
    destroy-on-close
  >
   
  </el-drawer> -->
</template>
<style scoped lang="scss">
.talk-box {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--talk-bg-color);
  position: relative;
  z-index: 1;
  .talk-container {
    width: 100%;
    height: calc(100vh - 55px);
    max-width: 960px;

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
}
</style>
<style></style>
