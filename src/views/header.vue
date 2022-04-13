<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";

import { useStore } from "@/store";

import allSvg from "../assets/svg/all.svg";
import sentSvg from "../assets/svg/sent.svg";
import receivedSvg from "../assets/svg/received.svg";
import unReadSvg from "../assets/svg/unRead.svg";
import logoSvg from "../assets/svg/logoHeader.svg";
import UserCenter from "./userCenter.vue";
import { Group } from "@/interface/User";

const store = useStore();
const user = computed(() => store.state.auth.user);
const groupList = computed(() => store.state.auth.groupList);
const receiver = computed(() => store.state.message.receiver);
const receiverType = computed(() => store.state.message.receiverType);
const receiverNumber = computed(() => store.state.message.receiverNumber);

const chooseVisible = ref<boolean>(false);
const themeVisible = ref<boolean>(false);
const chooseHeight = ref<number>(0);

const socket: any = inject("socket");

onMounted(() => {
  chooseHeight.value = document.documentElement.offsetHeight - 55;
  socket.on("message", function (msg) {
    console.log(msg);
    // my msg
  });
});

const changeReceiver = (type: string, item?: Group) => {
  store.commit("message/setReceiver", item ? item : null);
  store.commit("message/setReceiverType", type);
  store.commit("message/setTalker", item ? item : null);
  chooseVisible.value = false;
  store.dispatch("message/getMessageList", 1);
};

const backAll = () => {
  store.commit("message/setReceiver", null);
  store.commit("message/setReceiverType", "all");
  store.commit("message/setReceiverNumber", 0);
  store.dispatch("message/getMessageList", 1);
};
</script>
<template>
  <div class="talk-header dp-space-center p-5">
    <div class="header-left dp-center-center">
      <img :src="logoSvg" alt="" class="logo" @click="themeVisible = true" />
      <div class="dp--center" @click="chooseVisible = true">
        <!-- <span class="common-color">{{ $t(`surface.Messages`) }} : </span> -->

        <el-icon>
          <arrow-down />
        </el-icon>
      </div>
      <!-- <el-dropdown>
        <div class="dp--center">
          {{$t(`surface.Messages`)}}:
          <el-icon>
            <arrow-down />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>All</el-dropdown-item>
            <el-dropdown-item>我发出的</el-dropdown-item>
            <el-dropdown-item>我接受的</el-dropdown-item>
            <el-divider />
            <el-dropdown-item class="dp--center">
              <el-avatar
                :size="30"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              研发部
            </el-dropdown-item>
            <el-dropdown-item class="dp--center">
              <el-avatar
                :size="30"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              王小平
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown> -->
    </div>
    <div class="header-right dp--center">
        <span class="m-left-10 m-right-10">{{
          receiver ? receiver?.title : receiverType
        }}</span>
      <el-badge
        :value="receiverNumber"
        v-if="receiverType !== 'all'"
        :hidden="!receiverNumber"
      >
        <img :src="unReadSvg" alt="" @click="backAll" />
      </el-badge>
    </div>
  </div>
  <el-drawer
    v-model="chooseVisible"
    direction="btt"
    :with-header="false"
    :size="chooseHeight"
    custom-class="radius-drawer"
  >
    <div class="message-box">
      <div class="header">
        {{ $t(`surface['Message box']`) }}
      </div>
      <div class="container dp-space-center" @click="changeReceiver('all')">
        <div class="left dp--center">
          <img :src="allSvg" alt="" class="img" />
          <div class="name">{{ $t(`form.all`) }}</div>
        </div>
      </div>
      <div class="container dp-space-center" @click="changeReceiver('sent')">
        <div class="left dp--center">
          <img :src="sentSvg" alt="" class="img" />
          <div class="name">{{ $t(`form.sent`) }}</div>
        </div>
      </div>
      <div class="container dp-space-center" @click="changeReceiver('receive')">
        <div class="left dp--center">
          <img :src="receivedSvg" alt="" class="img" />
          <div class="name">{{ $t(`form.received`) }}</div>
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
            <el-avatar :size="40" :src="item.avatar" />
            <div class="name">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
  <el-drawer
    v-model="themeVisible"
    direction="ltr"
    :with-header="false"
    :size="210"
  >
    <user-center />
  </el-drawer>
</template>
<style scoped lang="scss">
.talk-header {
  width: 100%;
  height: 55px;
  .header-left {
    img {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }
}
.header {
  width: 100%;
  height: 65px;
  line-height: 65px;
  text-align: center;
}
.box {
  height: calc(100vh - 350px);
  overflow-y: auto;
}
</style>
<style></style>
