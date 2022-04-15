<script setup lang="ts">
import { ElMessage } from "element-plus";
import { Filter as ShowFilter } from "@element-plus/icons-vue";

import { useStore } from "@/store";

import logoSvg from "../assets/svg/logoHeader.svg";
import logowSvg from "../assets/svg/logoHeaderw.svg";
import UserCenter from "./userCenter.vue";
import HeaderFilter from "./filter.vue";

const store = useStore();
const receiver = computed(() => store.state.message.receiver);
const receiverType = computed(() => store.state.message.receiverType);
const receiverNumber = computed(() => store.state.message.receiverNumber);
const dark = computed(() => store.state.common.dark);

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

const backAll = () => {
  store.commit("message/setReceiver", null);
  store.commit("message/setReceiverType", "all");
  store.commit("message/setReceiverNumber", 0);
  store.dispatch("message/getMessageList", 1);
};
</script>
<template>
  <div class="talk-header dp-space-center">
    <div class="header-left dp-center-center">
      <img
        :src="dark ? logowSvg : logoSvg"
        alt=""
        class="logo"
        @click="themeVisible = true"
      />
      <span
        class="unread dp-center-center"
        v-if="receiverType !== 'all' && receiverNumber > 0"
        @click="backAll"
        >{{ receiverNumber > 99 ? "99+" : receiverNumber }}</span
      >
    </div>
    <div class="header-right dp--center" @click="chooseVisible = true">
      <el-avatar
        :size="40"
        :src="receiver?.avatar"
        v-if="receiver && receiver.receiverType === 'user'"
      />
      <span class="m-left-10 m-right-10">{{
        receiver ? receiver?.title : receiverType
      }}</span>
      <el-icon :size="20" class="filter"><show-filter /></el-icon>
      <!-- <el-badge
        :value="receiverNumber"
        v-if="receiverType !== 'all'"
        :hidden="!receiverNumber"
      >
        <img :src="unReadSvg" alt="" @click="backAll" />
      </el-badge> -->
    </div>
  </div>
  <el-drawer
    v-model="chooseVisible"
    direction="rtl"
    :with-header="false"
    :size="300"
    custom-class="p0-drawer"
  >
    <header-filter @close="chooseVisible = false" />
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
  height: 50px;
  padding: 0px 10px;
  box-sizing: border-box;
  .header-left {
    img {
      height: 10vw;
      max-height: 30px;
      min-height: 20px;
      cursor: pointer;
      margin-right: 10px;
    }
    .unread {
      width: 25px;
      height: 25px;
      background: var(--el-color-danger);
      color: #fff;
      box-sizing: border-box;
      font-size: 14px;
      border-radius: 50%;
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .header-right {
    cursor: pointer;
    .filter {
      color: var(--el-text-color-primary);
    }
  }
}
</style>
<style></style>
