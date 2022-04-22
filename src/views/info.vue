<script setup lang="ts">
import { Close, Star, StarFilled, Edit, Delete } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import api from "@/services/api";
import { Card, Reply } from "@/interface/Message";
import { ResultProps } from "@/interface/Common";
import Editor from "../components/editor/editor.vue";
import { ElMessage } from "element-plus";
import Tbutton from "@/components/tbutton.vue";

import groupSvg from "@/assets/svg/group.svg";
import deleteSvg from "@/assets/svg/delete.svg";
import unshakeSvg from "@/assets/svg/unshake.svg";
import unshakewSvg from "@/assets/svg/unshakew.svg";
import shakeSvg from "@/assets/svg/shake.svg";
import infoDelSvg from "@/assets/svg/infoDel.svg";
import infoDelwSvg from "@/assets/svg/infoDelw.svg";
import archiveSvg from "@/assets/svg/archive.svg";
import archivewSvg from "@/assets/svg/archivew.svg";
// const emits = defineEmits(["close"]);
const socket: any = inject("socket");

const router = useRouter();
const route = useRoute();
const user = computed(() => store.state.auth.user);
const dark = computed(() => store.state.common.dark);

const inputRef = ref(null);
const editorRef = ref(null);
const infoKey = ref<string>("");
const info = ref<Card | null>(null);
const favorite = ref<boolean>(false);
const receiverRole = ref<number>(4);
const store = useStore();
const replyInput = ref<string>("");
const replyList = ref<Reply[]>([]);
const updateState = ref<boolean>(false);
const shakeState = ref<boolean>(false);
onMounted(() => {
  infoKey.value = route.params.id as string;
  getInfo();
  socket.on("addComment", function (msg) {
    replyList.value.push(msg);
  });
  socket.on("deleteComment", function (msg) {
    console.log(msg);
    replyList.value = replyList.value.filter((item: Reply) => {
      return item._key !== msg._key;
    });
  });
});
const getInfo = async () => {
  let infoRes = (await api.request.get("card/detail", {
    cardKey: infoKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    info.value = infoRes.data;
    favorite.value = infoRes.data.favorite;
    if (infoRes.data.replyList) {
      replyList.value = infoRes.data.replyList;
    }
    receiverRole.value = infoRes.data.receiverRole;
  }
};
const postCard = async () => {
  if (editorRef.value) {
    //@ts-ignore
    editorRef.value.handlePost(
      "",
      (res) => {
        if (res.data.receiverType === "user") {
          store.commit("message/addMessageList", res.data);
          shakeState.value = false;
        }
      },
      true
    );
  }
};
const delCard = async () => {
  const delRes = (await api.request.delete("card", {
    cardKey: infoKey.value,
  })) as ResultProps;
  if (delRes.msg === "OK") {
    ElMessage.success("Delete Card Success");
    router.push("/home");
  }
};
const filedCard = async () => {
  const filedRes = (await api.request.patch("card/filed", {
    cardKey: infoKey.value,
    filed: true,
  })) as ResultProps;
  if (filedRes.msg === "OK") {
    ElMessage.success("Filed Card Success");
    router.push("/home");
  }
};
const favoriteCard = async () => {
  const postRes = (await api.request.patch("card/favorite", {
    cardKey: infoKey.value,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage.success("Favorite Success");
    favorite.value = !favorite.value;
  }
};
const addReply = async () => {
  const postRes = (await api.request.post("comment", {
    cardKey: infoKey.value,
    content: replyInput.value,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage.success("Reply Success");
    replyInput.value = "";
  }
};
const delReply = async (replyKey: string, index: number) => {
  const postRes = (await api.request.delete("comment", {
    commentKey: replyKey,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage.success("Delete Reply Success");
  }
};
</script>
<template>
  <div class="info">
    <div class="header dp-space-center">
      <div class="left dp--center">
        <span class="title">
          {{
            info?.receiverInfo && info.receiverInfo.receiverType === "user"
              ? user?._key === info?.creatorInfo?._key
                ? `To : `
                : `From : `
              : `In : `
          }}
        </span>
        <el-avatar
          fit="cover"
          :size="35"
          :src="
            info?.receiverInfo && info.receiverInfo.receiverType === 'group'
              ? groupSvg
              : user?._key === info?.creatorInfo?._key
              ? info?.receiverInfo?.logo
              : info?.creatorInfo?.userAvatar
          "
        />
        {{
          info?.receiverInfo && info.receiverInfo.receiverType === "group"
            ? info?.receiverInfo?.title
            : user?._key === info?.creatorInfo?._key
            ? info?.receiverInfo?.title
            : info?.creatorInfo?.userName
        }}
      </div>
      <div class="dp--center">
        <el-icon
          style="margin-right: 10px; margin-left: 10px; cursor: pointer"
          size="20px"
          @click="favoriteCard"
        >
          <star-filled v-if="favorite" />
          <star v-else />
        </el-icon>
        <el-icon
          style="margin-right: 10px; cursor: pointer"
          size="20px"
          @click="
            router.push('/home')
            // store.commit('message/setEditContent', null);
          "
          ><close
        /></el-icon>
      </div>
    </div>

    <div class="box">
      <div class="center p-5">
        <editor
          :init-data="info"
          :isEdit="
            user?._key === info?.creatorInfo?._key ||
            (receiverRole < 3 && info?.receiverInfo?.receiverType === 'group')
          "
          :cardKey="infoKey"
          :shake="shakeState"
          ref="editorRef"
          @changeUpdate="updateState = true"
        />
      </div>
      <div class="button dp-space-center p-5">
        <div class="left dp--center">
          <div
            class="button-item dp-center-center icon-point"
            v-if="updateState"
          >
            Changed
          </div>
        </div>
        <div class="right dp--center">
          <div
            class="button-item dp-center-center"
            v-if="
              info?.receiverInfo.receiverType === 'user' &&
              user?._key === info?.creatorInfo?._key
            "
          >
            <el-tooltip
              content="Shake"
              placement="left"
              class="button-item-icon"
            >
              <img
                :src="shakeSvg"
                alt=""
                v-if="shakeState"
                class="icon-point"
                style="width: 25px; height: 25px"
              />
              <img
                :src="dark ? unshakewSvg : unshakeSvg"
                alt=""
                v-else
                class="icon-point"
                style="width: 25px; height: 25px"
              />
            </el-tooltip>
          </div>
          <div
            class="button-item dp-center-center"
            v-if="
              user?._key === info?.creatorInfo?._key ||
              (receiverRole < 3 && info?.receiverInfo?.receiverType === 'group')
            "
          >
            <el-tooltip
              content="Archive"
              placement="top"
              class="button-item-icon"
            >
              <img
                :src="dark ? archivewSvg : archiveSvg"
                alt=""
                class="icon-point"
                style="width: 25px; height: 25px"
                @click="filedCard()"
              />
            </el-tooltip>
          </div>
          <div
            class="button-item dp-center-center"
            v-if="
              user?._key === info?.creatorInfo?._key ||
              (receiverRole < 2 && info?.receiverInfo?.receiverType === 'group')
            "
          >
            <el-tooltip
              content="Delete"
              placement="top"
              class="button-item-icon"
            >
              <img
                :src="dark ? infoDelwSvg : infoDelSvg"
                alt=""
                class="icon-point"
                style="width: 25px; height: 25px"
                @click="delCard()"
              />
            </el-tooltip>
          </div>
          <tbutton @click="postCard" v-if="updateState">{{
            $t(`surface.Update`)
          }}</tbutton>
        </div>
      </div>
      <div
        class="message p-5"
        v-for="(item, index) in replyList"
        :key="'reply' + index"
      >
        <div class="header message-header dp--center">
          <el-avatar fit="cover" :size="25" :src="item.userAvatar" />
          {{ item.userName }}
        </div>
        <div class="title">{{ item.content }}</div>
        <!--  
          " -->
        <div
          class="icon-point message-footer dp--center"
          @click="delReply(item._key, index)"
          v-if="
            (receiverRole < 3 &&
              info?.receiverInfo?.receiverType === 'group') ||
            info?.receiverInfo?.receiverType === 'user'
          "
        >
          <img :src="deleteSvg" alt="" style="width: 20px; height: 20px" />
        </div>
      </div>
    </div>
    <div class="footer p-5 dp-space-center">
      <el-input
        v-model="replyInput"
        size="large"
        :placeholder="`Please @ ${info?.creatorInfo?.userName} view`"
        ref="inputRef"
        @keydown.enter="addReply"
        style="width: calc(100% - 90px)"
      />
      <tbutton @click="addReply">{{ $t(`surface.Reply`) }}</tbutton>
    </div>
  </div>
</template>
<style scoped lang="scss">
.info {
  width: 100%;
  height: 100vh;
  background: var(--talk-bg-color);
  padding-bottom: 70px;
  box-sizing: border-box;
  .header {
    width: 100%;
    height: 55px;
    padding: 0px 10px;
    box-sizing: border-box;
    .left {
      font-size: 16px;
      .title {
        color: var(--talk-font-color-1);
        margin-right: 10px;
      }
    }
  }
  .box {
    width: 100%;
    max-height: calc(100% - 55px);
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    z-index: 1;
    .center {
      margin-bottom: 40px;
      position: relative;
      z-index: 1;
    }
    .button {
      width: 100%;
      height: 40px;
      .left,
      .right {
        height: 100%;
        .button-item {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
      }
    }
    .message {
      width: 100%;
      min-height: 100px;
      background: var(--talk-item-color);
      .message-header {
        padding: 0px;
        box-sizing: border-box;
      }
      .title {
        width: 100%;
        height: 25px;
        font-size: 14px;
        color: var(--talk-font-color-1);
      }
      .message-footer {
        width: 100%;
        height: 30px;
        justify-content: flex-end;
      }
    }
  }
  .footer {
    width: 100%;
    height: 70px;
    position: fixed;
    z-index: 2;
    left: 0px;
    bottom: 0px;
    box-sizing: border-box;
    background: var(--talk-item-color);
  }
}
</style>
<style></style>
