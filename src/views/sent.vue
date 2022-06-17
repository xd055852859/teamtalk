<script setup lang="ts">
import { useStore } from "@/store";
import Topic from "./topic.vue";
const store = useStore();
const receiverType = computed(() => store.state.message.receiverType);
</script>
<template>
  <theader headerIcon="menu" :headerTitle="$t(`I Send`)"></theader>
  <div class="dp-center-center icon-point">
    <div
      :style="
        receiverType === 'sent' ? { borderBottom: `3px solid #16ab78` } : {}
      "
      @click="store.commit('message/setReceiverType', 'sent')"
      class="tab-nav"
    >
      {{ $t(`I Send`) }}
    </div>
    <el-divider direction="vertical" />
    <div
      :style="
        receiverType === 'reply' ? { borderBottom: `3px solid #16ab78` } : {}
      "
      @click="store.commit('message/setReceiverType', 'reply')"
      class="tab-nav"
    >
     {{ $t(`I Reply`) }}
    </div>
  </div>
  <Topic />
</template>
<style scoped lang="scss"></style>
<style></style>
