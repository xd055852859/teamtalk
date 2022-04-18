<script setup lang="ts">
import { Close, Star, StarFilled } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import api from "@/services/api";
import { Card } from "@/interface/Message";
import { ResultProps } from "@/interface/Common";
import Editor from "../components/editor/editor.vue";
import { ElMessage } from "element-plus";
import Tbutton from "@/components/tbutton.vue";

import groupSvg from "@/assets/svg/group.svg";
// const emits = defineEmits(["close"]);
const router = useRouter();
const route = useRoute();
const user = computed(() => store.state.auth.user);
const groupRole = computed(() => store.state.auth.groupRole);
const talker = computed(() => store.state.message.talker);

const inputRef = ref(null);
const editorRef = ref(null);
const infoKey = ref<string>("");
const info = ref<Card | null>(null);
const favorite = ref<boolean>(false);
const store = useStore();
const replyInput = ref<string>("");
const replyList = ref<any>([]);
onMounted(() => {
  infoKey.value = route.params.id as string;
  getInfo();
});
const getInfo = async () => {
  let infoRes = (await api.request.get("card/detail", {
    cardKey: infoKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    info.value = infoRes.data;
    favorite.value = infoRes.data.favorite;
    if (info.value?.receiverInfo.receiverType === "group") {
      store.dispatch("auth/getMemberList", info.value.receiverInfo._key);
    }
    if (infoRes.data.replyList) {
      replyList.value = infoRes.data.replyList;
    }
  }
};
// const postContent = async () => {
//   console.log(editorRef.value);
//   if (talker.value && editorRef.value) {
//     //@ts-ignore
//     editorRef.value.handlePost(talker.value._key);
//   } else {
//     ElMessage.error("choose a receiver");
//     return;
//   }
// };
const favoriteCard = async () => {
  const postRes = (await api.request.patch("card/favorite", {
    cardKey: infoKey.value,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage.success("Favorite Success");
    favorite.value = !favorite.value;
  }
};
const replyCard = async () => {
  const postRes = (await api.request.post("card", {
    refKey: infoKey.value,
    title: replyInput.value,
    detail: "",
    summary: "",
    cover: "",
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage.success("Reply Success");
    replyList.value.push({
      creatorInfo: postRes.data.creatorInfo,
      title: postRes.data.title,
      _key: postRes.data._key,
    });
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
              ? `From : `
              : `In : `
          }}
        </span>
        <el-avatar
          :size="35"
          :src="
            info?.receiverInfo && info.receiverInfo.receiverType === 'group'
              ? groupSvg
              : info?.creatorInfo?.userAvatar
          "
        />
        {{
          info?.receiverInfo && info.receiverInfo.receiverType === "group"
            ? info?.receiverInfo?.title
            : info?.creatorInfo?.userName
        }}
      </div>
      <div>
        <el-icon
          style="margin-right: 10px; cursor: pointer"
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
            user?._key === info?.creatorInfo?.userAvatar ||
            (groupRole < 3 && info?.receiverInfo?.receiverType === 'group') ||
            info?.receiverInfo?.receiverType === 'user'
          "
          position="top"
          ref="editorRef"
        />
         <!-- <tbutton class="button" @click="postContent" v-if="talkKey">{{
      $t(`surface.Post`)
    }}</tbutton> -->
      </div>
      <div
        class="message p-5"
        v-for="(item, index) in replyList"
        :key="'reply' + index"
      >
        <div class="header dp--center">
          <el-avatar :size="25" :src="item.creatorInfo.userAvatar" />
          {{ item.creatorInfo.userName }}
        </div>
        <div class="title">{{ item.title }}</div>
      </div>
    </div>
    <div class="footer p-5">
      <el-input
        v-model="replyInput"
        size="large"
        :placeholder="`Please @ ${info?.creatorInfo?.userName} view`"
        ref="inputRef"
      />
      <div class="button dp--center" @click="replyCard">
        <tbutton>{{ $t(`surface.Reply`) }}</tbutton>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.info {
  width: 100%;
  height: 100vh;
  background: var(--talk-bg-color);
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
    max-height: calc(100% - 85px);
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    z-index: 1;
    padding-bottom: 100px;
    box-sizing: border-box;
    .center {
      // min-height: 250px;
      margin-bottom: 40px;
      position: relative;
      z-index: 1;
      .button {
        position: absolute;
        z-index: 5;
        top: 0px;
        right: 10px;
      }
    }
    .message {
      width: 100%;
      height: 100px;
      background-color: var(--talk-item-color);
      .header {
        padding: 0px;
        box-sizing: border-box;
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
    height: 130px;
    position: fixed;
    z-index: 2;
    left: 0px;
    bottom: 0px;
    background-color: var(--talk-item-color);
    padding-top: 20px;
    box-sizing: border-box;
    .button {
      width: 100%;
      height: 40px;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
}
</style>
<style></style>
