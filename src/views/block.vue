<script setup lang="ts">
import Theader from "@/components/theader.vue";
import IconFont from "@/components/iconFont.vue";

import api from "@/services/api";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";

import { Group } from "@/interface/User";
import { ResultProps } from "@/interface/Common";

import groupSvg from "@/assets/svg/group.svg";

const store = useStore();
const blockArray = ref<Group[]>([]);
onMounted(() => {
  getInfo();
});
const getInfo = async () => {
  let infoRes = (await api.request.get("receiver/block/list")) as ResultProps;
  if (infoRes.msg === "OK") {
    blockArray.value = [...infoRes.data];
  }
};
const outBlock = async (key: string, index: number) => {
  let outRes = (await api.request.patch("receiver/status", {
    receiverKey: key,
    block: false,
  })) as ResultProps;
  if (outRes.msg === "OK") {
    ElMessage({
      message: "Out Block Success",
      type: "success",
      duration: 1000,
    });
    blockArray.value.splice(index, 1);
    store.commit("auth/updateGroupList", {
      _key: key,
      block: false,
    });
  }
};
</script>
<template>
  <theader @clickBack="$router.back()">
    <template v-slot:title>
      <div class="dp-center-center">{{ $t(`text.BlockList`) }}</div>
    </template>
    <template v-slot:right><div></div></template>
  </theader>
  <div class="block p-5">
    <div class="info">
      <div
        class="container dp-space-center manage-item"
        v-for="(item, index) in blockArray"
        :key="'manage' + index"
      >
        <div class="left dp--center">
          <el-avatar
            fit="cover"
            :size="40"
            :src="item.avatar ? item.avatar : groupSvg"
          />
          <div class="name">{{ item.title }}</div>
        </div>
        <div class="right dp--center">
          <icon-font
            name="quit"
            :size="20"
            class="icon-point"
            @click="outBlock(item._key, index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.block {
  width: 100vw;
  height: calc(100vh - 55px);
  background: var(--talk-bg-color);
  .info {
    width: 100%;
    height: calc(100% - 55px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
<style></style>
