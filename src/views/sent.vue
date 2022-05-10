<script setup lang="ts">
import { useStore } from "@/store";
import Theader from "@/components/theader.vue";
import Topic from "./topic.vue";
const store = useStore();
const receiverType = computed(() => store.state.message.receiverType);
</script>
<template>
  <theader headerIcon="menu" :headerTitle="$t(`text['I send']`)"></theader>
  <div class="dp-center-center icon-point">
    <div
      :style="
        receiverType === 'sent' ? { borderBottom: `3px solid #16ab78` } : {}
      "
      @click="store.commit('message/setReceiverType', 'sent')"
    >
      {{ $t(`text['I send']`) }}
    </div>
    <el-divider direction="vertical" />
    <div
      :style="
        receiverType === 'reply' ? { borderBottom: `3px solid #16ab78` } : {}
      "
      @click="store.commit('message/setReceiverType', 'reply')"
    >
      I reply
    </div>
  </div>
  <Topic />
</template>
<style scoped lang="scss"></style>
<style></style>
