<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import Tbutton from "@/components/tbutton.vue";
import muteSvg from "@/assets/svg/mute.svg";
import blockSvg from "@/assets/svg/block.svg";
import deleteSvg from "@/assets/svg/delete.svg";
import api from "@/services/api";
import { Group } from "@/interface/User";
import router from "@/router";
import { ResultProps } from "@/interface/Common";
import Theader from "@/components/theader.vue";
const store = useStore();
const route = useRoute();
const user = computed(() => store.state.auth.user);
const muteState = ref<boolean>(false);
const blockState = ref<boolean>(false);
const memberKey = ref<string>("");
const info = ref<Group | null>(null);
onMounted(() => {
  memberKey.value = route.params.id as string;
  getInfo();
});
const getInfo = async () => {
  let infoRes = (await api.request.get("receiver/info", {
    receiverKey: memberKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    info.value = infoRes.data;
    muteState.value = infoRes.data.mute;
    blockState.value = infoRes.data.block;
  }
};
const toUser = () => {
  store.commit("message/setReceiver", info.value);
  store.commit("message/setReceiverType", "receiver");
  store.dispatch("message/getMessageList", 1);
  store.commit("message/setTalker", info.value);
  router.push("/home");
};
const changeConfig = async () => {
  let infoRes = (await api.request.patch("receiver/status", {
    receiverKey: memberKey.value,
    mute: muteState.value,
    block: blockState.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    ElMessage.success("Update Config Success");
  }
};
const deleteMember = async () => {
  let deleteRes = (await api.request.delete("receiver", {
    receiverKey: memberKey.value,
    mute: muteState.value,
    block: blockState.value,
  })) as ResultProps;
  if (deleteRes.msg === "OK") {
    ElMessage.success("Delete Member Success");
    store.commit("message/setReceiver", null);
    store.commit("message/setReceiverType", "all");
    store.dispatch("message/getMessageList", 1);
    store.dispatch("auth/getGroupList");
    router.push("/home");
  }
};
</script>
<template>
  <div class="member dp-center-center p-5">
    <Theader @clickBack="$router.back()">
      <template v-slot:title>{{ $t(`surface.Members`) }}</template>
    </Theader>
    <div class="member-user">
      <el-avatar :src="info?.avatar" :size="100" />
      <div class="center">{{ info?.title }}</div>
      <div class="bottom">{{ info?.email }}</div>
    </div>
    <div class="dp-space-center member-item">
      <div class="left dp--center"><img :src="muteSvg" alt="" /> Mute</div>
      <el-switch v-model="muteState" @change="changeConfig" />
    </div>
    <div class="dp-space-center member-item">
      <div class="left dp--center"><img :src="blockSvg" alt="" /> Block</div>
      <el-switch v-model="blockState" @change="changeConfig" />
    </div>
    <div class="dp-space-center member-item" @click="deleteMember()">
      <div class="left dp--center"><img :src="deleteSvg" alt="" /> Delete</div>
    </div>
    <div class="button dp-center-center">
      <tbutton @click="toUser()" style="width: 120px">{{
        $t(`surface.sendMessage`)
      }}</tbutton>
    </div>
  </div>
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
