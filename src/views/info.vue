<script setup lang="ts">
import { Close, Star, StarFilled } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import api from "@/services/api";
import { Card, Reply } from "@/interface/Message";
import { ResultProps } from "@/interface/Common";
import Editor from "../components/editor/editor.vue";
import { ElMessage } from "element-plus";
import Tbutton from "@/components/tbutton.vue";

import groupSvg from "@/assets/svg/group.svg";
import deleteSvg from "@/assets/svg/delete.svg";
// const emits = defineEmits(["close"]);
const socket: any = inject("socket");

const router = useRouter();
const route = useRoute();
const user = computed(() => store.state.auth.user);
const talker = computed(() => store.state.message.talker);

const inputRef = ref(null);
const editorRef = ref(null);
const infoKey = ref<string>("");
const info = ref<Card | null>(null);
const favorite = ref<boolean>(false);
const receiverRole = ref<number>(4);
const store = useStore();
const replyInput = ref<string>("");
const replyList = ref<Reply[]>([]);
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
// const postContent = async () => {
//   console.log(editorRef.value);
//   if (talker.value && editorRef.value) {
//     //@ts-ignore
//     editorRef.value.handlePost(info.value?.receiverInfo._key);
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
              ? `From : `
              : `In : `
          }}
        </span>
        <el-avatar
          fit="cover"
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
            (receiverRole < 3 &&
              info?.receiverInfo?.receiverType === 'group') ||
            info?.receiverInfo?.receiverType === 'user'
          "
          position="top"
          ref="editorRef"
        />
        <!-- <tbutton class="button" @click="postContent">{{
          $t(`surface.Update`)
        }}</tbutton> -->
      </div>
      <div
        class="message p-5"
        v-for="(item, index) in replyList"
        :key="'reply' + index"
      >
        <div class="header dp--center">
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
    <div class="footer p-5">
      <el-input
        v-model="replyInput"
        size="large"
        :placeholder="`Please @ ${info?.creatorInfo?.userName} view`"
        ref="inputRef"
      />
      <div class="button dp--center" @click="addReply">
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
      min-height: 100px;
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
      .message-footer {
        width: 100%;
        height: 40px;
        justify-content: flex-end;
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
