<script setup lang="ts">
import { ElMessage } from "element-plus";
// import router from "../router";
import { getSearchParamValue } from "../services/util";
import request from "@/services/api";
import logoSvg from "../assets/svg/logo.svg";
import logowSvg from "../assets/svg/logow.svg";
import { useStore } from "@/store";
import Tbutton from "@/components/tbutton.vue";
const store = useStore();
const router = useRouter();
const dark = computed(() => store.state.common.dark);
// import store from "@/store";
onMounted(() => {
  console.log(location.search);
  if (localStorage.getItem("token")) {
    console.log(router);
    router.push("/home");
  }
  window.addEventListener("message", handle, false);
});
onUnmounted(() => {
  window.removeEventListener("message", handle, false);
});
const handle = (e: any) => {
  if (
    e.origin === "https://account.qingtime.cn" &&
    e.data.eventName === "redirect"
  ) {
    const token = getSearchParamValue(
      e.data.data.split("?")[1],
      "token"
    ) as string;
    request.setToken(token);
    store.commit("auth/setToken", token);
    router.push("/home");
  }
};
const login = () => {
  let redirect = `${window.location.protocol}//${window.location.host}/`;
  // let href: string = `https://account.qingtime.cn?apphigh=50&redirect=${redirect}&logo=https://cdn-icare.qingtime.cn/1605251458500_workingVip`;
  let href: string = `https://account.qingtime.cn?apphigh=50&redirect=${redirect}&logo=https://cdn-ttalk.qingtime.cn/1650011827416_workingVip.png`;
  console.log(href);
  console.log("https://workfly.qingtime.cn/1650010668239_workingVip.png");
  window.open(
    href,
    "new",
    `width=360, height=560, resizable=false, toolbar=no, menubar=no, location=no, status=no, top=${
      (document.body.clientHeight - 420) / 2
    }, left=${(document.body.clientWidth - 360) / 2}`
  );
};
</script>
<template>
  <div class="welcome">
    <div class="logo-img dp-center-center">
      <img :src="dark ? logowSvg : logoSvg" alt="" class="logo" />
    </div>
    <tbutton @click="login" class="button">{{ $t(`surface.Login`) }}</tbutton>
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
    margin-bottom: 20vh;
    .logo {
      max-width: 400px;
      width: 70vw;
      margin-bottom: 10px;
    }
  }

  .title {
    width: 100%;
    height: 40px;
    text-align: center;
    margin-bottom: 20vh;
    font-size: 18px;
    font-weight: 400;
    color: #999;
    line-height: 40px;
  }
  .button {
    width: 20vw;
    max-width: 120px;
    min-width: 70px;
    height: 10vw;
    max-height: 50px;
    min-height: 40px;
  }
}
</style>
<style></style>
