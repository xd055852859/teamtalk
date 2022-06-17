<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";

import i18n from "@/language/i18n";
import router from "@/router";
import api from "@/services/api";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";

import { ResultProps } from "@/interface/Common";
import { Mate } from "@/interface/User";

const store = useStore();
const route = useRoute();

const muteState = ref<boolean>(false);
const blockState = ref<boolean>(false);
const memberKey = ref<string>("");
const delVisible = ref<boolean>(false);
const info = ref<Mate | null>(null);
onMounted(() => {
  memberKey.value = route.params.id as string;
  getInfo();
});
const getInfo = async () => {
  let infoRes = (await api.request.get("user/targetInfo", {
    targetUser: memberKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    let obj: Mate = {
      email: infoRes.data.email,
      userAvatar: infoRes.data.userAvatar,
      userName: infoRes.data.userName,
      boardNum: infoRes.data.boardNum,
      topicNum: infoRes.data.topicNum,
      replyNum: infoRes.data.replyNum,
      _key: memberKey.value,
    };
    if (infoRes.data.receiverKey) {
      obj.receiverKey = infoRes.data.receiverKey;
    }
    info.value = { ...obj };
    muteState.value = infoRes.data.mute;
    blockState.value = infoRes.data.block;
  }
};
const toUser = () => {
  let obj = {
    _key: info.value?.receiverKey,
    avatar: info.value?.userAvatar,
    block: blockState.value,
    mute: muteState.value,
    receiverType: "user",
    title: info.value?.userName,
    toUserKey: info.value?._key,
  };
  store.commit("message/setReceiver", obj);
  store.commit("message/setReceiverType", "receiver");
  store.dispatch("message/getMessageList", 1);
  router.push("/home");
};
const changeConfig = async () => {
  let infoRes = (await api.request.patch("receiver/status", {
    receiverKey: info.value?.receiverKey,
    mute: muteState.value,
    block: blockState.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`Update succeeded`),
      type: "success",
      duration: 1000,
    });
    if (muteState.value) {
      store.commit("auth/addMuteList", memberKey.value);
    } else {
      store.commit("auth/delMuteList", memberKey.value);
    }
    store.commit("auth/updateGroupList", {
      _key: info.value?.receiverKey,
      block: blockState.value,
    });
  }
};
const saveMember = async () => {
  const saveRes = (await api.request.post("receiver", {
    receiverType: "user",
    toUserKey: info.value?._key,
  })) as ResultProps;
  if (saveRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`Friend add succeeded`),
      type: "success",
      duration: 1000,
    });
    if (info.value) {
      info.value.receiverKey = saveRes.data._key;
      toUser();
    }
    //
  }
};
const deleteMember = async () => {
  let deleteRes = (await api.request.delete("receiver", {
    receiverKey: info.value?.receiverKey,
  })) as ResultProps;
  if (deleteRes.msg === "OK") {
    ElMessage({
      message: "Delete Mate Success",
      type: "success",
      duration: 1000,
    });
    delVisible.value = false;
    store.commit("message/setReceiver", null);
    store.commit("message/setReceiverType", "all");
    store.commit("auth/delGroupList", info.value?.receiverKey);
    router.back();
  }
};
</script>
<template>
  <theader @clickBack="$router.back()">
    <template v-slot:title>{{ $t(`Mates`) }}</template>
    <template v-slot:right><div></div></template>
  </theader>
  <div class="member dp-center-center p-5">
    <div class="member-user">
      <el-avatar fit="cover" :src="info?.userAvatar" :size="100" />
      <div class="center">{{ info?.userName }}</div>
      <div class="bottom">{{ info?.email }}</div>
    </div>
    <template v-if="info?.receiverKey">
      <div
        class="dp-space-center member-item icon-point"
        @click="$router.push('/home/mateBoard/' + memberKey)"
      >
        <div class="left dp--center">
          <icon-font name="boards" :size="30" style="margin-right: 15px" />
          {{ $t(`Boards`) }}
        </div>
        <div class="dp-space-center">
          <span style="margin-right: 10px">{{ info?.boardNum }}</span>
          <el-icon><arrow-right /></el-icon>
        </div>
      </div>
      <div class="dp-space-center member-item">
        <div class="left dp--center">
          <icon-font name="topic" :size="30" style="margin-right: 15px" />Topics
        </div>
        <div class="dp-center-center right">
          {{ info?.topicNum }}
        </div>
      </div>
      <div class="dp-space-center member-item">
        <div class="left dp--center">
          <icon-font name="reply" :size="30" style="margin-right: 15px" />Replys
        </div>
        <div class="dp-center-center right">
          {{ info?.replyNum }}
        </div>
      </div>
      <div class="dp-space-center member-item">
        <div class="left dp--center">
          <icon-font name="mute" :size="30" style="margin-right: 15px" />{{
            $t(`Mute`)
          }}
        </div>
        <el-switch
          active-color="#16ab78"
          v-model="muteState"
          @change="changeConfig"
        />
      </div>
      <div class="dp-space-center member-item">
        <div class="left dp--center">
          <icon-font name="block" :size="30" style="margin-right: 15px" />
          {{ $t(`Block`) }}
        </div>
        <el-switch
          active-color="#16ab78"
          v-model="blockState"
          @change="changeConfig"
        />
      </div>
      <div
        class="dp-space-center member-item icon-point"
        @click="delVisible = true"
      >
        <div class="left dp--center">
          <icon-font name="delete" :size="30" style="margin-right: 15px" />
          {{ $t(`Delete`) }}
        </div>
      </div>
    </template>
    <div class="button dp-center-center" v-if="!info?.receiverKey">
      <tbutton @click="saveMember()" style="width: 120px">{{ `Add` }}</tbutton>
    </div>
  </div>
  <el-dialog v-model="delVisible" :title="$t(`Delete prompt`)" :width="300">
    <span>{{ $t(`Delete friends`) }}</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="delVisible = false" bgColor="#d1dbe5">{{
          $t(`Cancel`)
        }}</tbutton>
        <tbutton @click="deleteMember()">{{ $t(`OK`) }}</tbutton>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.member {
  width: 100%;
  height: calc(100vh - 55px);
  //   align-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  .member-user {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    span {
      margin-right: 0px;
    }
    .center {
      width: 100%;
      height: 20px;
      font-size: 20px;
      margin: 10px 0px;
      line-height: 20px;
      text-align: center;
    }
    .bottom {
      width: 100%;
      height: 20px;
      font-size: 14px;
      color: #999999;
      line-height: 20px;
      text-align: center;
    }
  }
  .member-item {
    width: 100%;
    height: 50px;
    .left {
      img {
        width: 30px;
        height: 30px;
        margin-right: 15px;
      }
    }
    .right {
      width: 40px;
      height: 100%;
    }
  }
  .button {
    width: 100%;
    height: 40px;
    position: fixed;
    z-index: 5;
    left: 0px;
    bottom: 50px;
  }
}
</style>
<style></style>
