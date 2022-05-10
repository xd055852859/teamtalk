<script setup lang="ts">
import api from "@/services/api";
import Theader from "@/components/theader.vue";
import Tbutton from "@/components/tbutton.vue";
import IconFont from "@/components/iconFont.vue";
import { useStore } from "@/store";
import { ElMessage } from "element-plus";
import i18n from "@/language/i18n";

import { ResultProps } from "@/interface/Common";
import { BoardObj } from "@/interface/User";

const store = useStore();
const route = useRoute();
const user = computed(() => store.state.auth.user);

const teamKey = ref<string>("");
const teamInfo = ref<BoardObj>();
onMounted(() => {
  teamKey.value = route.params.id as string;
  getInfo();
});
const getInfo = async () => {
  let infoRes = (await api.request.get("receiver/info", {
    receiverKey: teamKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    teamInfo.value = infoRes.data;
  }
};
const saveMember = async () => {
  const groupRes = (await api.request.patch("receiver", {
    receiverKey: teamInfo.value?._key,
    memberKeyArr: [user.value?._key],
  })) as ResultProps;
  if (groupRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Join the group successfully']`),

      type: "success",
      duration: 1000,
    });
  }
};
const joinTeam = async () => {
  const joinRes = (await api.request.post("receiver/join/apply", {
    receiverKey: teamInfo.value?._key,
  })) as ResultProps;
  if (joinRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Successfully applied']`),
      type: "success",
      duration: 1000,
    });
  }
};
</script>
<template>
  <theader>
    <template v-slot:title>Mate's boards</template>
  </theader>
  <div class="mateBoard p-5">
    <div>Moderator :</div>
    <div class="mateBoard-avatar dp--center">
      <div
        v-for="(avatarItem, avatarIndex) in teamInfo?.moderator"
        :key="'avatar' + avatarIndex"
        style="margin-bottom: 10px"
        class="mateBoard-avatar-item"
      >
        <img alt="" :src="avatarItem.userAvatar" />
      </div>
    </div>
    <div class="dp-space-center mateBoard-item">
      <div class="left dp--center">
        <icon-font
          name="subscriber"
          :size="30"
          style="margin-right: 15px"
        />Subscribers
      </div>
      99
    </div>
    <div class="dp-space-center mateBoard-item">
      <div class="left dp--center">
        <icon-font name="note" :size="30" style="margin-right: 15px" />Notes
      </div>
      99
    </div>
  </div>
  <div class="button dp-center-center">
    <tbutton
      style="width: 120px"
      @click="teamInfo?.allowJoin ? saveMember() : joinTeam()"
    >
      {{ teamInfo?.allowJoin ? "Join" : "Ask To Join" }}
    </tbutton>
  </div>
</template>
<style scoped lang="scss">
.mateBoard {
  width: 100%;
  height: calc(100vh - 55px);
  //   align-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  .mateBoard-avatar {
    width: 100%;
    margin: 15px 0px;
    flex-wrap: wrap;
    .mateBoard-avatar-item {
      width: 120px;
      height: 120px;
      overflow: hidden;
      border-radius: 50%;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .mateBoard-item {
    width: 100%;
    height: 50px;
    cursor: pointer;
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
}
.button {
  width: 100%;
  height: 40px;
  position: fixed;
  z-index: 5;
  left: 0px;
  bottom: 20px;
}
</style>
<style></style>
