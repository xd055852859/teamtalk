<script setup lang="ts">
import Editor from "@/components/editor/editor.vue";
import EditorNav from "@/components/editor/editorNav.vue";
import MessageItem from "@/components/messageItem.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { Member } from "@/interface/User";
import { useStore } from "@/store";
import { Search } from "@element-plus/icons-vue";

import toTopSvg from "../assets/svg/toTop.svg";
import Board from "./board.vue";
import router from "@/router";

const store = useStore();
const route = useRoute();

const receiver = computed(() => store.state.message.receiver);
const receiverType = computed(() => store.state.message.receiverType);
const groupRole = computed(() => store.state.auth.groupRole);
const messageList = computed(() => store.state.message.messageList);
const pageNumber = computed(() => store.state.message.pageNumber);
const editorInfo = computed(() => store.state.message.editorInfo);
const page = computed(() => store.state.message.page);
const user = computed(() => store.state.auth.user);
const applyList = computed(() => store.state.auth.applyList);
const deviceType = computed(() => store.state.common.deviceType);

const teamKey = ref<string>("");
const talkRef = ref(null);
const editorRef = ref(null);
const avatarRef = ref(null);

const topVisible = ref<boolean>(false);
const shakeState = ref<boolean>(false);
const boardVisible = ref<boolean>(false);
const overKey = ref<string>("");
const searchInput = ref<string>("");

const loading = ref<boolean>(false);
const memberList = ref<Member[]>([]);
onMounted(() => {
  init(route.params.id as string);
  //@ts-ignore
  // talkRef.value.scrollTop = top.value;
});
const init = (key: string) => {
  teamKey.value = key as string;
  if (key) {
    getInfo();
    store.dispatch("auth/getMemberList", key);
  }
  store.commit("message/setEditContent", null);
  store.commit("message/setEditKey", "");
};
const getInfo = async () => {
  let infoRes = (await api.request.get("receiver/info", {
    receiverKey: teamKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    store.commit("message/setReceiver", infoRes.data);
    store.commit("message/setReceiverType", "");
    store.dispatch("message/getMessageList", 1);
    memberList.value = infoRes.data.moderator;
  }
};
const postContent = async () => {
  if (receiver.value && editorRef.value) {
    loading.value = true;
    store.commit("message/setEditContent", null);
    store.commit("message/setEditKey", "");
    //@ts-ignore
    editorRef.value.handlePost(receiver.value._key, (res) => {
      if (res.data.creatorInfo._key === user.value?._key) {
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
  // store.commit("common/setTop", scrollTop);
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
    talkRef.value.scrollTop -= 80; // 使高度每次减少20px
    //@ts-ignore
    if (talkRef.value.scrollTop <= 0) {
      clearInterval(timer); // 关闭定时器
    }
  }, 30);
};
const moveAvatar = (e) => {
  //@ts-ignore
  avatarRef.value.scrollLeft += e.deltaY;
};
watch(
  receiverType,
  (newVal) => {
    if (newVal) {
      store.dispatch("message/getMessageList", 1);
    }
  },
  { immediate: true }
);
watch(
  route,
  (newVal) => {
    if (newVal && newVal.name === "topic") {
      //@ts-ignore
      init(newVal.params.id as string);
    }
  },
  { deep: true }
);
</script>
<template>
  <theader
    v-if="!receiverType"
    @clickBack="
      $router.push('/home');
      api.request.patch('message', { receiverKey: teamKey });
    "
    clickState
    headerState
    :headerIcon="deviceType === 'phone' ? 'menu' : ''"
    @headerClick="boardVisible = true"
  >
    <template v-slot:title>{{ receiver?.title }}</template>
    <template v-slot:right>
      <icon-font
        name="set"
        @click="
          receiver
            ? receiver.receiverType === 'user'
              ? $router.push(`/member/${receiver.toUserKey}`)
              : $router.push(`/manage/${receiver._key}`)
            : null
        "
      />
      <el-badge
        :value="applyList.length"
        :max="99"
        style="margin-top: -10px"
        v-if="applyList?.length > 0 && groupRole < 2"
      >
      </el-badge>
    </template>
  </theader>
  <div
    class="talk-box"
    @scroll="scrollLoading"
    ref="talkRef"
    :class="{
      'dp-center-center': deviceType === 'phone',
      'dp-space-center': deviceType !== 'phone',
    }"
  >
    <div class="talk-left" v-if="deviceType !== 'phone'"></div>
    <div class="talk-menu" v-if="deviceType !== 'phone'">
      <board type="menu" :boardHeight="'110px'"></board>
    </div>
    <div
      class="talk-container p-5"
      :style="{
        height:
          receiverType && receiverType !== 'favorite'
            ? 'calc(100vh - 95px)'
            : 'calc(100vh - 55px)',
        width: deviceType === 'phone' ? '100%' : 'calc(100% - 300px)',
      }"
    >
      <div
        class="talk-edit"
        v-if="
          !receiverType &&
          ((receiver?.receiverType === 'group' && groupRole <= 3) ||
            receiver?.receiverType === 'user')
        "
        @click="
          store.commit('message/setEditContent', null);
          store.commit('message/setEditKey', '');
        "
      >
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
            <template v-if="receiver?.receiverType === 'user'">
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
            <tbutton @click="postContent" @loading="loading">{{
              $t(`button.Send`)
            }}</tbutton>
          </div>
        </div>
      </div>
      <template v-if="!receiverType && receiver?.receiverType !== 'user'">
        <div class="avatar-title">Members :</div>
        <div
          class="avatar dp--center"
          @wheel.prevent.stop="moveAvatar"
          ref="avatarRef"
        >
          <template v-if="receiver?.receiverType === 'group'">
            <!-- .slice(0, 5) -->
            <div
              v-for="(avatarItem, avatarIndex) in memberList"
              :key="'avatar' + avatarIndex"
              class="icon-point avatar-item"
              :style="
                avatarItem.role === 0 ? { border: '2px solid #16ab78' } : {}
              "
              @click.stop="
                avatarItem._key !== user?._key
                  ? $router.push(`/member/` + avatarItem._key)
                  : null
              "
            >
              <img :src="avatarItem.userAvatar" alt="" />
            </div>
          </template>
          <!-- <template v-if="memberList.length > 5"
            >等 {{ memberList.length }} 人</template
          > -->
        </div>
      </template>
      <el-divider border-style="dashed" />
      <!-- <el-input v-model="searchInput" placeholder="Enter Topic Title">
        <template #append> <el-button :icon="Search" /> </template
      ></el-input> -->
      <div
        v-for="(item, index) in messageList"
        :key="'chat' + index"
        @mouseenter="overKey = item._key"
      >
        <div
          class="notice dp-center-center single-to-long"
          v-if="item.type === 'notice'"
        >
          {{ item.title }}
        </div>
        <message-item :item="item" :overKey="overKey" v-else />
      </div>
      <div class="toTop icon-point" v-if="topVisible" @click="toTop">
        <img :src="toTopSvg" alt="" style="width: 50px; height: 50px" />
      </div>
    </div>
  </div>

  <el-drawer
    v-model="boardVisible"
    direction="ltr"
    :with-header="false"
    :size="280"
    custom-class="p0-drawer"
    destroy-on-close
  >
    <board
      type="menu"
      :boardHeight="'calc(100% - 55px)'"
      @close="boardVisible = false"
    ></board>
  </el-drawer>
</template>
<style scoped lang="scss">
.talk-box {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--talk-bg-color);
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  .talk-menu {
    width: 280px;
    height: calc(100vh - 55px);
    top: 55px;
    left: 0px;
    position: fixed;
    z-index: 10;
  }
  .talk-container {
    .talk-edit {
      width: 100%;
      min-height: 200px;
      background-color: var(--talk-item-color);
      border: 2px solid rgba(30, 30, 30, 1);
      border-radius: 8px;
      padding: 10px 0px;
      box-sizing: border-box;
      .editor {
        width: 100%;
        min-height: 185px;
        overflow: auto;
        position: relative;
        z-index: 1;
        box-sizing: border-box;
      }
      .bottom {
        height: 30px;
        padding: 0px 12px 0px 22px;
        .button {
          img {
            width: 20px;
            height: 20px;
            margin-right: 15px;
          }
        }
      }
    }
    .avatar-title {
      height: 30px;
      font-size: 18px;
      line-height: 30px;
      margin: 10px 0px;
    }
    .avatar {
      min-width: 100%;
      height: 45px;
      overflow-x: auto;
      overflow-y: hidden;

      .avatar-item {
        width: 40px;
        height: 40px;
        margin-right: 8px;
        flex-shrink: 0;
        border-radius: 50%;
        overflow: hidden;
        img {
          user-select: none;
          width: 100%;
          height: 100%;
          object-fit: cover;
          -webkit-user-drag: none;
        }
      }
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
    }
    .notice {
      width: 100%;
      height: 40px;
      margin: 10px 0px;
      color: var(--talk-font-color-2);
      font-size: 14px;
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
