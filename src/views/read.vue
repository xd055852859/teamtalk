<script setup lang="ts">
import { useStore } from "@/store";
import Topic from "./topic.vue";
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
      <!-- <div class="dp--center icon-point">
        <icon-font name="clear" :size="26" style="margin-right: 15px" />
      </div> -->
      <tbutton v-if="receiverType === 'unRead'" @click="clearVisible = true">
        Set Readed
      </tbutton>
    </template>
  </theader>
  <div class="dp-center-center icon-point">
    <div
      :style="
        receiverType === 'unRead' ? { borderBottom: `3px solid #16ab78` } : {}
      "
      @click="store.commit('message/setReceiverType', 'unRead')"
      class="tab-nav"
    >
      unread {{ `( ${unReadNum} )` }}
    </div>
    <el-divider direction="vertical" />
    <div
      :style="
        receiverType === 'read' ? { borderBottom: `3px solid #16ab78` } : {}
      "
      @click="store.commit('message/setReceiverType', 'read')"
       class="tab-nav"
    >
      Readed
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
        <tbutton @click="clearVisible = false"  bgColor="#d1dbe5">{{
          $t(`button.Cancel`)
        }}</tbutton>
        <tbutton @click="clearRead()">{{ $t(`button.OK`) }}</tbutton>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss"></style>
<style></style>
