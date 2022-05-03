<script setup lang="ts">
import Tbutton from "@/components/tbutton.vue";

import { useStore } from "@/store";

import logoSvg from "../assets/svg/logo.svg";
import logowSvg from "../assets/svg/logow.svg";

const store = useStore();
const router = useRouter();
const dark = computed(() => store.state.common.dark);
// import store from "@/store";
onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push("/home");
  }
});

const login = () => {
  let redirect = `${window.location.protocol}//${window.location.host}/#/home/`;
  let href: string = `https://account.qingtime.cn?apphigh=50&redirect=${redirect}&logo=https://workfly.qingtime.cn/1650849409262_workingVip.png`;
  window.open(href, "_self");
};
</script>
<template>
  <div class="welcome">
    <div class="logo-img dp-center-center">
      <img :src="dark ? logowSvg : logoSvg" alt="" class="logo" />
    </div>
    <tbutton @click="login" class="button">{{ $t(`button.Login`) }}</tbutton>
  </div>
</template>
<style scoped lang="scss">
.welcome {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  background: var(--talk-bg-color);
  .logo-img {
    width: 100%;
    margin-bottom: 40vh;
    .logo {
      max-width: 400px;
      width: 70vw;
    }
  }

  .button {
    width: 90px;
    height: 30px;
  }
}
</style>
<style></style>
