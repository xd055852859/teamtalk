<script setup lang="ts">
import { useStore } from "@/store";

import { Group } from "@/interface/User";
import IconFont from "@/components/iconFont.vue";

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
      {{ $t(`text['Message center']`) }}
    </div>
    <div class="container dp-space-center" @click="changeReceiver('all')">
      <div class="left dp--center">
        <icon-font name="all" :size="22"></icon-font>
        <div class="name">{{ $t(`text.All`) }}</div>
      </div>
    </div>
    <div
      class="container dp-space-center"
      @click="changeReceiver('private', null, groupItem)"
    >
      <div class="left dp--center">
        <icon-font name="private" :size="22"></icon-font>
        <div class="name">{{ $t(`text.Private`) }}</div>
      </div>
    </div>
    <div class="container dp-space-center" @click="changeReceiver('favorite')">
      <div class="left dp--center">
        <icon-font name="favorite" :size="22"></icon-font>
        <div class="name">{{ $t(`text.Favourite`) }}</div>
      </div>
    </div>
    <div class="container dp-space-center" @click="changeReceiver('sent')">
      <div class="left dp--center">
        <icon-font name="send" :size="22"></icon-font>
        <div class="name">{{ $t(`text['I send']`) }}</div>
      </div>
    </div>
    <div class="container dp-space-center" @click="changeReceiver('receive')">
      <div class="left dp--center">
        <icon-font name="received" :size="22"></icon-font>
        <div class="name">{{ $t(`text['I received']`) }}</div>
      </div>
    </div>
    <div class="container dp-space-center" @click="changeReceiver('notice')">
      <div class="left dp--center">
        <icon-font name="notice" :size="22"></icon-font>
        <div class="name">{{ $t(`text['System messages']`) }}</div>
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
    <!-- <div class="button dp-space-center"></div> -->
  </div>
</template>
<style scoped lang="scss">
.filter {
  width: 100%;
  height: 100vh;
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
