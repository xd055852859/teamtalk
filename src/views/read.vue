<script setup lang="ts">
import { useStore } from "@/store";
import Theader from "@/components/theader.vue";
import Topic from "./topic.vue";
import Tbutton from "@/components/tbutton.vue";
import IconFont from "@/components/iconFont.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { ElMessage } from "element-plus";

const store = useStore();
const receiverType = computed(() => store.state.message.receiverType);
const unReadNum = computed(() => store.state.message.unReadNum);

const clearVisible = ref<boolean>(false);
const clearRead = async () => {
  let clearRes = (await api.request.patch("message")) as ResultProps;
  if (clearRes.msg === "OK") {
    ElMessage({
      message: "Clear Success",
      type: "success",
      duration: 1000,
    });
    store.commit("message/setUnreadNum", 0);
    if (receiverType.value === "unRead") {
      store.commit("message/setMessageList", []);
    }
    clearVisible.value = false;
  }
};
</script>
<template>
  <theader headerIcon="menu" headerTitle="News">
    <template v-slot:right>
      <div
        class="dp--center icon-point"
        v-if="receiverType === 'unRead'"
        @click="clearVisible = true"
      >
        <icon-font name="clear" :size="26" style="margin-right: 15px" />
      </div>
    </template>
  </theader>
  <div class="dp-center-center icon-point">
    <div
      :style="
        receiverType === 'unRead' ? { borderBottom: `3px solid #16ab78` } : {}
      "
      @click="store.commit('message/setReceiverType', 'unRead')"
    >
      unRead {{ `( ${unReadNum} )` }}
    </div>
    <el-divider direction="vertical" />
    <div
      :style="
        receiverType === 'read' ? { borderBottom: `3px solid #16ab78` } : {}
      "
      @click="store.commit('message/setReceiverType', 'read')"
    >
      Read
    </div>
  </div>
  <Topic />
  <el-dialog
    v-model="clearVisible"
    :title="'Clear'"
    :width="300"
    :append-to-body="true"
  >
    <span>Clear UnRead</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="clearVisible = false" :disabled="true">{{
          $t(`button.Cancel`)
        }}</tbutton>
        <tbutton @click="clearRead()">{{ $t(`button.OK`) }}</tbutton>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss"></style>
<style></style>
