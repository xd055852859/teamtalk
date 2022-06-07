<script setup lang="ts">
import Editor from "../components/editor/editor.vue";

import api from "@/services/api";
import i18n from "@/language/i18n";
import { useStore } from "@/store";
import { ElMessage } from "element-plus";
import {
  MoreFilled,
  Star,
  StarFilled,
  ArrowDown,
  ArrowUp,
} from "@element-plus/icons-vue";

import { Card, Read, Reply } from "@/interface/Message";
import { ResultProps } from "@/interface/Common";

import groupSvg from "@/assets/svg/group.svg";
import IconFont from "@/components/iconFont.vue";

const socket: any = inject("socket");
const dayjs: any = inject("dayjs");
const props = defineProps<{ cardKey?: string }>();
const router = useRouter();
const route = useRoute();
const user = computed(() => store.state.auth.user);
const dark = computed(() => store.state.common.dark);
const memberList = computed(() => store.state.auth.memberList);
const updateState = computed(() => store.state.common.updateState);
const deviceType = computed(() => store.state.common.deviceType);
const receiver = computed(() => store.state.message.receiver);

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
const delVisible = ref<boolean>(false);
const readVisible = ref<boolean>(false);
const unreadVisible = ref<boolean>(false);
const readList = ref<Read[]>([]);
const unReadList = ref<Read[]>([]);

onMounted(() => {
  console.log(route.name);
  infoKey.value =
    route.name === "info"
      ? (route.params.id as string)
      : (props.cardKey as string);
  getInfo();
  socket.on("addComment", function (msg) {
    if (msg.creatorInfo._key !== user.value?._key) {
      replyList.value.push(msg);
    }
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
    store.commit("message/updateMessageList", {
      _key: infoKey.value,
      hasRead: 1,
      receiverKey: receiver.value?._key,
    });
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
      true
    );
    store.commit("common/setUpdateState", false);
  }
};
const rePostCard = async () => {
  if (editorRef.value) {
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
      props.cardKey ? true : false,
      true
    );
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
    router.back();
    store.commit("message/delMessageList", infoKey.value);
    store.commit("message/setEditContent", null);
    store.commit("message/setEditKey", "");
  }
};
// const filedCard = async () => {
//   const filedRes = (await api.request.patch("card/filed", {
//     cardKey: infoKey.value,
//     filed: true,
//   })) as ResultProps;
//   if (filedRes.msg === "OK") {
//     ElMessage({
//       message: i18n.global.t(`tip['Archived successfully']`),
//       type: "success",
//       duration: 1000,
//     });
//     if (!props.cardKey && deviceType.value !== "mobile") {
//       router.push("/home");
//     }
//     store.commit("message/delMessageList", infoKey.value);
//     store.commit("message/setEditContent", null);
//     store.commit("message/setEditKey", "");
//   }
// };
const getReadList = async () => {
  let readRes = (await api.request.get("card/readRecord", {
    cardKey: infoKey.value,
  })) as ResultProps;
  if (readRes.msg === "OK") {
    readList.value = readRes.data.hasRead.map((item) => {
      item.readTime = dayjs(item.readTime).toNow();
      console.log(item.readTime);
      return item;
    });
    unReadList.value = readRes.data.unRead.map((item) => {
      item.readTime = dayjs(item.readTime).toNow();
      return item;
    });
    readVisible.value = true;
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
    let obj = {
      ...postRes.data,
      unRead: 0,
      commentCount: postRes.data.commentCount,
      _key: postRes.data.cardKey,
    };
    store.commit("message/updateMessageList", obj);
    replyList.value.push(postRes.data);
  }
};
const delReply = async (replyKey: string, index: number) => {
  const postRes = (await api.request.delete("comment", {
    commentKey: replyKey,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Delete reply successfully']`),
      type: "success",
      duration: 1000,
    });
  }
};

defineExpose({
  postCard,
  rePostCard,
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
    <theader v-if="!cardKey && deviceType !== 'mobile'">
      <template #title>
        <div class="dp-center-center">
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
      </template>
      <template #right>
        <div class="dp--center">
          <el-tooltip :content="'favorite'">
            <el-icon
              style="margin-right: 8px"
              size="20px"
              @click="favoriteCard"
            >
              <star-filled v-if="favorite" />
              <star v-else />
            </el-icon>
          </el-tooltip>
          <el-dropdown>
            <el-icon :size="16"><more-filled /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="delVisible = true"
                  >删除</el-dropdown-item
                >
                <el-dropdown-item @click.stop="getReadList"
                  >已读列表</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </theader>

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
              <icon-font
                :name="shakeState ? 'shake' : 'unshake'"
                class="icon-point"
                :size="cardKey ? 20 : 25"
                :color="shakeState ? '#16ab78' : ''"
                @click="shakeState = true"
              />
            </el-tooltip>
          </div>
          <!-- <div
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
              <icon-font
                name="archive"
                :size="cardKey ? 15 : 17"
                class="icon-point"
                @click.once="filedCard()"
              />
            </el-tooltip>
          </div> -->
          <!-- <div
            class="button-item dp-center-center"
            :style="cardKey ? { width: '35px', height: '35px' } : {}"
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
              <icon-font
                name="delete"
                :size="cardKey ? 20 : 25"
                class="icon-point"
                @click="delVisible = true"
                :hover="true"
              />
            </el-tooltip>
          </div> -->
          <tbutton @click.once="postCard" v-if="updateState && !cardKey">{{
            $t(`button.Update`)
          }}</tbutton>
        </div>
      </div>
      <el-divider border-style="dashed" />
      <!-- <div class="comment-title p-5">Comment</div> -->
      <div
        class="message p-5"
        v-for="(item, index) in replyList"
        :key="'reply' + index"
      >
        <div class="message-header dp-space-center">
          <div class="dp--center">
            <el-avatar fit="cover" :size="25" :src="item.userAvatar" />
            {{ item.userName }}
          </div>
          <div
            class="icon-point message-right dp--center"
            @click="delReply(item._key, index)"
          >
            <icon-font
              name="delete"
              :size="20"
              v-if="
                user?._key === item.userKey ||
                (receiverRole < 2 &&
                  info?.receiverInfo?.receiverType === 'group')
              "
            />
          </div>
        </div>
        <div class="title">
          <span v-if="item.atUserName">{{ `@ ${item.atUserName}` }}</span>
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
        <tbutton
          @click="addReply"
          :disabled="!replyInput"
          :bgColor="replyInput ? '' : '#d1dbe5'"
          >{{ $t(`button.Reply`) }}</tbutton
        >
      </div>
    </div>
  </div>
  <el-drawer
    v-model="readVisible"
    direction="rtl"
    :size="350"
    custom-class="p0-drawer"
    :append-to-body="true"
    title="Readed"
  >
    <div class="read-box">
      <div
        class="read-item dp-space-center"
        v-for="(item, index) in readList"
        :key="'read' + index"
      >
        <div class="left dp--center">
          <el-avatar
            fit="cover"
            :size="25"
            :src="item.userAvatar"
            class="icon-point"
          />
          {{ item.userName }}
        </div>
        <div class="right dp--center">{{ item.readTime }}</div>
      </div>
      <div
        class="read-title dp--center icon-point"
        @click="unreadVisible = !unreadVisible"
      >
        <span style="margin-right: 10px">Unread</span>
        <el-icon
          ><arrow-up v-if="unreadVisible" /><arrow-down v-else
        /></el-icon>
      </div>
      <template v-if="unreadVisible">
        <div
          class="read-item dp--center"
          v-for="(item, index) in unReadList"
          :key="'unRead' + index"
        >
          <div class="left dp--center">
            <el-avatar
              fit="cover"
              :size="25"
              :src="item.userAvatar"
              class="icon-point"
            />
            {{ item.userName }}
          </div>
        </div>
      </template>
    </div>
  </el-drawer>
  <el-dialog
    v-model="delVisible"
    :title="$t(`dialog['Delete prompt']`)"
    :width="300"
    :append-to-body="true"
  >
    <span>{{ $t(`dialog['Delete card']`) }}</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="delVisible = false" bgColor="#d1dbe5">{{
          $t(`button.Cancel`)
        }}</tbutton>
        <tbutton @click="delCard()">{{ $t(`button.OK`) }}</tbutton>
      </span>
    </template>
  </el-dialog>
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
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
      // padding-top: 20px;
      box-sizing: border-box;
    }
    .button {
      // width: 100%;
      height: 40px;
      right: -25px;
      top: 5px;
      z-index: 10;
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
    .comment-title {
      font-size: 16px;
    }
    .message {
      width: 100%;
      min-height: 100px;
      // background: var(--talk-item-color);
      .message-header {
        width: 100%;
        height: 30px;
        padding: 0px;
        box-sizing: border-box;
        margin-bottom: 5px;
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
        padding-left: 35px;
        box-sizing: border-box;
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
.read-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 15px 5%;
  box-sizing: border-box;
  .read-item {
    width: 100%;
    height: 35px;
  }
  .read-title {
    height: 35px;
    margin: 10px 0px;
    color: #9c9c9c;
    font-size: 14px;
  }
}
</style>
<style></style>
