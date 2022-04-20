<script setup lang="ts">
import { ElMessage } from "element-plus";
import { Filter as ShowFilter, Close, User } from "@element-plus/icons-vue";

import { useStore } from "@/store";

import logoSvg from "../assets/svg/logoHeader.svg";
import logowSvg from "../assets/svg/logoHeaderw.svg";
import UserCenter from "./userCenter.vue";
import HeaderFilter from "./filter.vue";
// import privateSvg from "../assets/svg/private.svg";
// import favoriteSvg from "../assets/svg/favorite.svg";
// import sendSvg from "../assets/svg/send.svg";
// import receivedSvg from "../assets/svg/received.svg";

const store = useStore();
const receiver = computed(() => store.state.message.receiver);
const receiverType = computed(() => store.state.message.receiverType);
const receiverNumber = computed(() => store.state.message.receiverNumber);
const dark = computed(() => store.state.common.dark);

const chooseVisible = ref<boolean>(false);
const themeVisible = ref<boolean>(false);

const headerImg = ref<string>("");

const backAll = () => {
  store.commit("message/setReceiver", null);
  store.commit("message/setReceiverType", "all");
  store.commit("message/setReceiverNumber", 0);
  store.dispatch("message/getMessageList", 1);
};
// watchEffect(() => {
//   switch (receiverType.value) {
//     case "private":
//       headerImg.value = privateSvg;
//       break;
//     case "favorite":
//       headerImg.value = favoriteSvg;
//       break;
//     case "send":
//       headerImg.value = sendSvg;
//       break;
//     case "received":
//       headerImg.value = receivedSvg;
//       break;
//   }
// });
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
    <div class="header-right dp--center">
      <template v-if="receiverType !== 'all'">
        <div
          class="m-right-10 filter-close dp-space-center"
          :style="!receiver ? { background: '#e2e2e2' } : {}"
        >
          <el-avatar
            fit="cover"
            :size="30"
            :src="receiver?.avatar"
            v-if="receiver"
          />
          <!-- <img
            :src="headerImg"
            alt=""
            style="width: 20px; height: 20px; margin-right: 8px"
          /> -->
          {{
            receiver
              ? receiver?.title
              : receiverType.slice(0, 1).toUpperCase() +
                receiverType.slice(1).toLowerCase()
          }}
          <el-icon
            :size="20"
            class="filter"
            @click="backAll"
            style="margin-left: 5px"
            ><close
          /></el-icon>
        </div>
      </template>
      <el-icon :size="20" class="filter" @click="chooseVisible = true"
        ><show-filter
      /></el-icon>
      <el-icon :size="20" class="filter" @click="$router.push('/partner')"
        ><user
      /></el-icon>
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
      cursor: pointer;
      color: var(--el-text-color-primary);
    }
    .filter-close {
      // width: 60px;
      padding: 5px 10px;
    }
  }
}
</style>
<style></style>
