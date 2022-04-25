<script setup lang="ts">
import Tbutton from "@/components/tbutton.vue";
import Theader from "@/components/theader.vue";

import i18n from "@/language/i18n";
import router from "@/router";
import api from "@/services/api";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";

import { ResultProps } from "@/interface/Common";
import { Mate } from "@/interface/User";

import muteSvg from "@/assets/svg/mute.svg";
import blockSvg from "@/assets/svg/block.svg";
import deleteSvg from "@/assets/svg/delete.svg";

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
  store.commit("message/setTalker", obj);
  router.push("/home");
};
const changeConfig = async () => {
  let infoRes = (await api.request.patch("receiver/status", {
    receiverKey: info.value?.receiverKey,
    mute: muteState.value,
    block: blockState.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    ElMessage.success("Update Config Success");
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
    ElMessage.success(i18n.global.t(`tip['Friend add succeeded']`));
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
    ElMessage.success("Delete Mate Success");
    delVisible.value = false;
    store.commit("message/setReceiver", null);
    store.commit("message/setReceiverType", "all");
    store.dispatch("auth/getGroupList");
    router.push("/home");
  }
};
</script>
<template>
  <div class="member dp-center-center p-5">
    <Theader @clickBack="$router.back()">
      <template v-slot:title>{{ $t(`surface.Members`) }}</template>
      <template v-slot:right><div></div></template>
    </Theader>
    <div class="member-user">
      <el-avatar fit="cover" :src="info?.userAvatar" :size="100" />
      <div class="center">{{ info?.userName }}</div>
      <div class="bottom">{{ info?.email }}</div>
    </div>
    <template v-if="info?.receiverKey">
      <div class="dp-space-center member-item">
        <div class="left dp--center">
          <img :src="muteSvg" alt="" /> {{ $t(`form.mute`) }}
        </div>
        <el-switch
          active-color="#16ab78"
          v-model="muteState"
          @change="changeConfig"
        />
      </div>
      <div class="dp-space-center member-item">
        <div class="left dp--center">
          <img :src="blockSvg" alt="" /> {{ $t(`form.block`) }}
        </div>
        <el-switch
          active-color="#16ab78"
          v-model="blockState"
          @change="changeConfig"
        />
      </div>
      <div class="dp-space-center member-item" @click="delVisible = true">
        <div class="left dp--center">
          <img :src="deleteSvg" alt="" /> Delete
        </div>
      </div>
    </template>
    <div class="button dp-center-center">
      <tbutton
        @click="info?.receiverKey ? toUser() : saveMember()"
        style="width: 120px"
        >{{
          info?.receiverKey ? $t(`surface.talkto`) : $t(`surface.add`)
        }}</tbutton
      >
    </div>
  </div>
  <el-dialog v-model="delVisible" title="Delete" :width="300">
    <span>{{ $t(`form.deleteMate`) }}</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="delVisible = false" :disabled="true">Cancel</tbutton>
        <tbutton @click="deleteMember()">Sure</tbutton>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.member {
  width: 100%;
  height: 100%;
  background: var(--talk-bg-color);
  //   align-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  .member-user {
    margin-top: 7vh;
    margin-bottom: 40px;
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
    height: 70px;
    cursor: pointer;
    .left {
      img {
        width: 30px;
        height: 30px;
        margin-right: 15px;
      }
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
