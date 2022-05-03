<script setup lang="ts">
import Editor from "../components/editor/editor.vue";
import Tbutton from "@/components/tbutton.vue";

import api from "@/services/api";
import i18n from "@/language/i18n";
import { useStore } from "@/store";
import { ElMessage } from "element-plus";
import { Close, Star, StarFilled } from "@element-plus/icons-vue";

import { Card, Reply } from "@/interface/Message";
import { ResultProps } from "@/interface/Common";

import groupSvg from "@/assets/svg/group.svg";
import deleteSvg from "@/assets/svg/delete.svg";
import unshakeSvg from "@/assets/svg/unshake.svg";
import unshakewSvg from "@/assets/svg/unshakew.svg";
import shakeSvg from "@/assets/svg/shake.svg";
import infoDelSvg from "@/assets/svg/infoDel.svg";
import infoDelwSvg from "@/assets/svg/infoDelw.svg";
import archiveSvg from "@/assets/svg/archive.svg";
import archivewSvg from "@/assets/svg/archivew.svg";

const socket: any = inject("socket");
const props = defineProps<{ cardKey?: string }>();
const router = useRouter();
const route = useRoute();
const user = computed(() => store.state.auth.user);
const dark = computed(() => store.state.common.dark);
const memberList = computed(() => store.state.auth.memberList);
const updateState = computed(() => store.state.common.updateState);

const inputRef = ref(null);
const editorRef = ref(null);
const infoKey = ref<string>("");
const info = ref<Card | null>(null);
const favorite = ref<boolean>(false);
const receiverRole = ref<number>(4);
const store = useStore();
const replyInput = ref<string>("");
const replyList = ref<Reply[]>([]);
const shakeState = ref<boolean>(false);
const atUser = ref<{ [key: string]: string } | null>(null);
onMounted(() => {
  infoKey.value = (route.params.id as string) || (props.cardKey as string);
  getInfo();
  socket.on("addComment", function (msg) {
    replyList.value.push(msg);
  });
  socket.on("deleteComment", function (msg) {
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
    if (info.value?.receiverInfo.receiverType === "group") {
      store.dispatch("auth/getMemberList", info.value?.receiverInfo._key);
    }
  }
};
const postCard = async () => {
  if (editorRef.value && updateState.value) {
    //@ts-ignore
    editorRef.value.handlePost(
      "",
      (res) => {
        if (res.data.receiverType === "user") {
          store.commit("message/updateMessageList", res.data);
          shakeState.value = false;
        }
      },
      true,
      props.cardKey ? true : false
    );
    store.commit("common/setUpdateState", false);
  }
};
const delCard = async () => {
  const delRes = (await api.request.delete("card", {
    cardKey: infoKey.value,
  })) as ResultProps;
  if (delRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Deleted successfully']`),
      type: "success",
      duration: 1000,
    });
    router.push("/home");
    store.commit("message/delMessageList", infoKey.value);
  }
};
const filedCard = async () => {
  const filedRes = (await api.request.patch("card/filed", {
    cardKey: infoKey.value,
    filed: true,
  })) as ResultProps;
  if (filedRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Archived successfully']`),
      type: "success",
      duration: 1000,
    });
    router.push("/home");
    store.commit("message/delMessageList", infoKey.value);
  }
};
const favoriteCard = async () => {
  const postRes = (await api.request.patch("card/favorite", {
    cardKey: infoKey.value,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Set Favourite successfully']`),
      type: "success",
      duration: 1000,
    });
    favorite.value = !favorite.value;
  }
};
const addReply = async () => {
  const postRes = (await api.request.post("comment", {
    cardKey: infoKey.value,
    content: replyInput.value,
    atUser: atUser.value,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Reply succeeded']`),
      type: "success",
      duration: 1000,
    });
    replyInput.value = "";
  }
};
const delReply = async (replyKey: string, index: number) => {
  const postRes = (await api.request.delete("comment", {
    commentKey: replyKey,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage({
      message: `Delete Reply Success`,
      type: "success",
      duration: 1000,
    });
  }
};

defineExpose({
  postCard,
});
</script>
<template>
  <div
    class="info"
    v-if="info"
    :style="
      cardKey
        ? {}
        : {
            height: '100vh',
            background: 'var(--talk-bg-color)',
            paddingBottom: '100px',
          }
    "
  >
    <div class="header dp-space-center" v-if="!cardKey">
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
         <el-tooltip :content="'favorite'">
        <el-icon
          style="margin-right: 10px; margin-left: 10px; cursor: pointer"
          size="20px"
          @click="favoriteCard"
        >
          <star-filled v-if="favorite" />
          <star v-else />
        </el-icon>
        </el-tooltip>
        <el-icon
          style="margin-right: 10px; cursor: pointer"
          size="20px"
          @click="
            store.commit('message/setEditContent', null);
            store.commit('message/setEditKey', '');
            router.back();
            // store.commit('message/setEditContent', null);
          "
          ><close
        /></el-icon>
      </div>
    </div>

    <div class="box">
      <div class="center p-5">
        <editor
          :init-data="cardKey ? null : info"
          :isEdit="
            user?._key === info?.creatorInfo?._key ||
            (receiverRole < 3 && info?.receiverInfo?.receiverType === 'group')
          "
          :cardKey="infoKey"
          :shake="shakeState"
          ref="editorRef"
        />
      </div>
      <div
        class="button dp-space-center p-5"
        :style="cardKey ? { position: 'absolute' } : {}"
      >
        <div class="left dp--center"></div>
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
            :style="cardKey ? { width: '25px', height: '25px' } : {}"
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
                :style="
                  cardKey
                    ? { width: '20px', height: '20px' }
                    : { width: '25px', height: '25px' }
                "
                @click.once="filedCard()"
              />
            </el-tooltip>
          </div>
          <div
            class="button-item dp-center-center"
            :style="cardKey ? { width: '25px', height: '25px' } : {}"
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
                :style="
                  cardKey
                    ? { width: '20px', height: '20px' }
                    : { width: '25px', height: '25px' }
                "
                @click.once="delCard()"
              />
            </el-tooltip>
          </div>
          <tbutton @click.once="postCard" v-if="updateState && !cardKey">{{
            $t(`button.Update`)
          }}</tbutton>
        </div>
      </div>
      <el-divider border-style="dashed" />
      <div
        class="message p-5"
        v-for="(item, index) in replyList"
        :key="'reply' + index"
      >
        <div class="header message-header dp-space-center">
          <div class="dp--center">
            <el-avatar fit="cover" :size="25" :src="item.userAvatar" />
            {{ item.userName }}
          </div>
          <div
            class="icon-point message-right dp--center"
            @click="delReply(item._key, index)"
          >
            <img
              :src="deleteSvg"
              alt=""
              style="width: 20px; height: 20px"
              class=""
              v-if="
                user?._key === item.userKey ||
                (receiverRole < 2 &&
                  info?.receiverInfo?.receiverType === 'group')
              "
            />
          </div>
        </div>
        <div class="title">
          <span class="common-color" v-if="item.atUserName">{{
            `@ ${item.atUserName}`
          }}</span>
          {{ item.content }}
        </div>
        <!--  
          " -->
      </div>
    </div>
    <div
      class="footer p-5"
      :style="
        cardKey ? {} : { position: 'fixed', background: 'var(--talk-bg-color)' }
      "
    >
      <el-input
        v-model="replyInput"
        size="large"
        :placeholder="`Please Enter Reply`"
        ref="inputRef"
        @change="addReply"
        style="width: 100%; margin-bottom: 10px; margin-top: 10px"
      >
        <template #prepend v-if="info?.receiverInfo.receiverType === 'group'">
          <el-select
            v-model="atUser"
            placeholder="@ member"
            style="width: 120px"
          >
            <el-option
              v-for="(item, index) in memberList"
              :key="'member' + index"
              :label="item.userName"
              :value="item._key"
            />
          </el-select>
        </template>
      </el-input>
      <div class="button dp--center">
        <tbutton @click="addReply">{{ $t(`button.Reply`) }}</tbutton>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.info {
  width: 100%;
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
      right: -15px;
      top: 0px;
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
      // background: var(--talk-item-color);
      .message-header {
        padding: 0px;
        box-sizing: border-box;
        .message-right {
          height: 100%;
          display: none;
        }
      }
      &:hover .message-right {
        display: flex;
      }
      .title {
        width: 100%;
        height: 25px;
        font-size: 14px;
        color: var(--talk-font-color-1);
      }
    }
  }
  .footer {
    width: 100%;
    height: 100px;
    z-index: 2;
    left: 0px;
    bottom: 0px;
    box-sizing: border-box;
    .button {
      justify-content: flex-end;
    }
  }
}
</style>
<style></style>
