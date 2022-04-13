<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
import { useStore } from "@/store";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import setDark from "@/hooks/dark";
import setTheme from "@/hooks/theme";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";

import groupSvg from "@/assets/svg/group.svg";
const { proxy } = useCurrentInstance();

const store = useStore();
const router = useRouter();

const user = computed(() => store.state.auth.user);
const dark = computed(() => store.state.common.dark);
const theme = computed(() => store.state.common.theme);
const token = computed(() => store.state.auth.token);
const socket: any = inject("socket");
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
onMounted(() => {
  let url = window.location.href;
  //自动切换为https
  if (url.indexOf("http://localhost") === -1 && url.indexOf("https") < 0) {
    url = url.replace("http:", "https:");
    window.location.replace(url);
  }
  setDark(dark.value);
  setTheme(theme.value);
});
//初始化
const init = async () => {
  const userInfoRes = (await api.request.get("user")) as ResultProps;
  if (userInfoRes.msg === "OK") {
    store.commit("auth/setUserInfo", {
      _key: userInfoRes.data._key,
      userAvatar: userInfoRes.data.userAvatar,
      userName: userInfoRes.data.userName,
      email: userInfoRes.data.email,
      config: userInfoRes.data.config,
    });
    if (userInfoRes?.data?.config) {
      proxy.$i18n.locale = userInfoRes.data.config.locale;
    }
  }
};

watchEffect(() => {
  if (token.value) {
    init();
    store.dispatch("auth/getGroupList");
    store.dispatch("auth/getUptoken");
    socket.on("connect", (res) => {
      socket.emit("login", token.value);
      socket.on("card", function (msg) {
        console.log("card", msg);
        store.commit("message/updateMessageList", msg);
      });
    });
  } else {
    router.push("/");
  }
});
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
*::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

*::-webkit-scrollbar-thumb {
  background: var(--el-color-primary);
  border-radius: 100px;
}
.common-color {
  color: var(--el-color-primary);
}
.container {
  padding: 10px;
  box-sizing: border-box;
  .left {
    // cursor: pointer;
    .img {
      width: 40px;
      height: 40px;
    }
    .name {
      margin-left: 15px;
      font-size: 18px;
      font-weight: 400;
    }
  }
  .right {
    cursor: pointer;
    // display: none;
  }
  &:hover {
    background-color: var(--talk-hover-color);
    // .right {
    //   display: block;
    // }
  }
}
</style>
