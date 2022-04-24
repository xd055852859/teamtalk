<script setup lang="ts">
import { ElMessage } from "element-plus";
import { Group, Search } from "@/interface/User";
import { useStore } from "@/store";
import Theader from "@/components/theader.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import quitSvg from "@/assets/svg/Quit.svg";
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
    ElMessage.success("Out Block Success");
    blockArray.value.splice(index, 1);
    store.commit("auth/updateGroupList", {
      _key: key,
      block: false,
    });
  }
};
</script>
<template>
  <div class="block p-5">
    <theader @clickBack="$router.back()">
      <template v-slot:title>
        <div class="dp-center-center">Block List</div>
      </template>
      <template v-slot:right><div></div></template>
    </theader>
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
          <img
            :src="quitSvg"
            alt=""
            style="width: 20px; height: 20px"
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
  height: 100vh;
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
