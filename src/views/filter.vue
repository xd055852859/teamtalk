<script setup lang="ts">
import { useStore } from "@/store";

import allSvg from "../assets/svg/all.svg";
import privateSvg from "../assets/svg/private.svg";
import favoriteSvg from "../assets/svg/favorite.svg";
import sendSvg from "../assets/svg/send.svg";
import receivedSvg from "../assets/svg/received.svg";
import noticeSvg from "../assets/svg/notice.svg";
import allwSvg from "../assets/svg/allw.svg";
import privatewSvg from "../assets/svg/privatew.svg";
import favoritewSvg from "../assets/svg/favoritew.svg";
import sendwSvg from "../assets/svg/sendw.svg";
import receivedwSvg from "../assets/svg/receivedw.svg";
import noticewSvg from "../assets/svg/noticew.svg";
import { Group } from "@/interface/User";
import Tbutton from "@/components/tbutton.vue";
const router = useRouter();
const store = useStore();

const emits = defineEmits(["close"]);

const user = computed(() => store.state.auth.user);
const groupList = computed(() => store.state.auth.groupList);
const groupItem = computed(() => store.state.auth.groupItem);

const dark = computed(() => store.state.common.dark);

const changeReceiver = (
  type: string,
  item?: Group | null,
  privateItem?: Group | null
) => {
  store.commit("message/setReceiver", item ? item : null);
  store.commit("message/setReceiverType", type);
  if (item || privateItem) {
    store.commit("message/setTalker", item ? item : privateItem);
  }
  emits("close");
  store.dispatch("message/getMessageList", 1);
};
</script>
<template>
  <div class="filter p-5">
    <div class="header">
      {{ $t(`surface['Message box']`) }}
    </div>
    <div class="container dp-space-center" @click="changeReceiver('all')">
      <div class="left dp--center">
        <img :src="dark?allwSvg:allSvg" alt="" class="img" />
        <div class="name">{{ $t(`form.all`) }}</div>
      </div>
    </div>
    <div
      class="container dp-space-center"
      @click="changeReceiver('private', null, groupItem)"
    >
      <div class="left dp--center">
        <img :src="dark?privatewSvg:privateSvg" alt="" class="img" />
        <div class="name">{{ $t(`form.private`) }}</div>
      </div>
      <div class="right dp--center">{{ user?.privateMessageCount }}</div>
    </div>
    <div class="container dp-space-center" @click="changeReceiver('favorite')">
      <div class="left dp--center">
        <img :src="dark?favoritewSvg:favoriteSvg" alt="" class="img" />
        <div class="name">{{ $t(`form.favorite`) }}</div>
      </div>
      <div class="right dp--center">{{ user?.favoriteMessageCount }}</div>
    </div>
    <div class="container dp-space-center" @click="changeReceiver('sent')">
      <div class="left dp--center">
        <img :src="dark?sendwSvg:sendSvg" alt="" class="img" />
        <div class="name">{{ $t(`form.send`) }}</div>
      </div>
      <div class="right dp--center">{{ user?.sentMessageCount }}</div>
    </div>
    <div class="container dp-space-center" @click="changeReceiver('receive')">
      <div class="left dp--center">
        <img :src="dark?receivedwSvg:receivedSvg" alt="" class="img" />
        <div class="name">{{ $t(`form.received`) }}</div>
      </div>
    </div>
     <div class="container dp-space-center" @click="changeReceiver('notice')">
      <div class="left dp--center">
        <img :src="dark?noticewSvg:noticeSvg" alt="" class="img" />
        <div class="name">{{ $t(`form.notice`) }}</div>
      </div>
    </div>
    <el-divider />
    <div class="box">
      <div
        class="container dp-space-center"
        v-for="(item, index) in groupList"
        :key="'manage' + index"
        @click="changeReceiver('receiver', item)"
      >
        <div class="left dp--center">
          <el-avatar fit="cover" :size="40" :src="item.avatar" />
          <div class="name">{{ item.title }}</div>
        </div>
      </div>
    </div>
    <div class="button dp-space-center">
     
    </div>
  </div>
</template>
<style scoped lang="scss">
.filter {
  .header {
    width: 100%;
    height: 45px;
    line-height: 45px;
  }
  .box {
    width: 100%;
    height: calc(100vh - 380px);
    overflow-y: auto;
  }
  .button {
    width: 100%;
    height: 45px;
  }
}
</style>
<style></style>
