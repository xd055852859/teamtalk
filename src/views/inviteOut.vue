<script setup lang="ts">
import { ElMessage } from "element-plus";

import useClipboard from "vue-clipboard3";
import QrcodeVue from "qrcode.vue";
import { store } from "@/store";
import i18n from "@/language/i18n";
const { toClipboard } = useClipboard();
const router = useRouter();
const user = computed(() => store.state.auth.user);
const url = computed(
  () =>
    `${window.location.protocol}//${window.location.host}/?inviteKey=${user.value?._key}`
);
</script>
<template>
  <div class="invite-out p-5">
    <theader @clickBack="router.push('/invite')">
      <template v-slot:title> {{ $t(`Invite Partner`) }} </template>
      <template v-slot:right><div></div> </template>
    </theader>
    <div class="invite-item dp-center-center">
      <div class="title">{{ $t(`Way2`) }}</div>
      <div class="title">
        {{ $t(`invite TeamTalk`, { MateName: user?.userName }) }}
      </div>
      <div class="title">
        {{ url }}
      </div>
      <tbutton
        @click="
          toClipboard(url);
          ElMessage({
            message: i18n.global.t(`Copy Success`),
            type: 'success',
            duration: 1000,
          });
        "
        style="height: 30px"
        >Copy</tbutton
      >
    </div>
    <el-divider />
    <div class="invite-item dp-center-center" v-if="url">
      <div class="title">{{ $t(`Way3`) }}</div>
      <div
        class="invite-item dp-center-center"
        style="width: 100%; height: 200px"
      >
        <qrcode-vue :value="url" :size="150" level="H" />
      </div>
      <tbutton
        @click="
          toClipboard(url);
          ElMessage({
            message: i18n.global.t(`Copy Success`),
            type: 'success',
            duration: 1000,
          });
        "
        style="height: 30px"
        >{{ $t(`Download`) }}</tbutton
      >
    </div>
  </div>
</template>
<style scoped lang="scss">
.invite-out {
  width: 100vw;
  height: 100vh;
  background: var(--talk-bg-color);
  .header {
    width: 100%;
    height: 55px;
  }
  .invite-item {
    width: 100%;
    height: calc(50vh - 80px);
    flex-wrap: wrap;
    align-content: center;
    .title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      text-align: center;
      margin-bottom: 10px;
    }
  }
}
</style>
<style></style>
