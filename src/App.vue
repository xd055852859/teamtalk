<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
import { useStore } from "@/store";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import setDark from "@/hooks/dark";
import setTheme from "@/hooks/theme";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { getSearchParamValue } from "@/services/util";
import request from "@/services/api";
import groupSvg from "@/assets/svg/group.svg";
import strongestMusic from "@/assets/audio/strongest.mp3";
import strongMusic from "@/assets/audio/strong.mp3";

import { Group } from "./interface/User";
const { proxy } = useCurrentInstance();
const socket: any = inject("socket");
const store = useStore();
const router = useRouter();

const user = computed(() => store.state.auth.user);
const groupList = computed(() => store.state.auth.groupList);

const musicRef = ref(null);
const dark = computed(() => store.state.common.dark);
const theme = computed(() => store.state.common.theme);
const token = computed(() => store.state.auth.token);

let talkKey = "";
let infoKey = "";
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
onBeforeMount(() => {
  let url = window.location.href;
  //自动切换为https
  if (url.indexOf("http://localhost") === -1 && url.indexOf("https") < 0) {
    url = url.replace("http:", "https:");
    window.location.replace(url);
  }
  const search = window.location.search
    ? window.location.search.split("?")[1]
    : window.location.hash.split("?")[1];
  const token = getSearchParamValue(search, "token") as string;
  talkKey = getSearchParamValue(search, "talkKey") as string;
  infoKey = getSearchParamValue(search, "infoKey") as string;
  if (token) {
    request.setToken(token);
    store.commit("auth/setToken", token);
    if (talkKey) {
      store.commit("message/setTalkKey", talkKey);
      router.push("/createCard");
    } else if (infoKey) {
      store.commit("message/setInfoKey", infoKey);
      router.push(`/info/${infoKey}`);
    } else {
      router.push("/home");
    }
  }
});
onMounted(() => {
  setDark(dark.value);
  setTheme(theme.value);
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
      favoriteMessageCount: userInfoRes.data.favoriteMessageCount,
      privateMessageCount: userInfoRes.data.privateMessageCount,
      sentMessageCount: userInfoRes.data.sentMessageCount,
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

    socket.on("connect", () => {
      socket.emit("login", token.value);
      socket.on("card", function (msg) {
        // 1:1卡片
        if (msg.creatorInfo._key !== user.value?._key) {
          if (msg.receiverType === "user") {
            //@ts-ignore
            musicRef.value.src = strongestMusic;
            //@ts-ignore
            musicRef.value.play();
          } else if (msg.receiverType === "group") {
            //@ts-ignore
            musicRef.value.src = strongMusic;
            //@ts-ignore
            musicRef.value.play();
          }
        }
        console.log("card", msg);
        store.commit("message/addMessageList", msg);
      });
      socket.on("addComment", function (msg) {
        console.log(msg);
        let obj = { commentCount: msg.commentCount, _key: msg.cardKey };
        // store.commit("message/updateMessageList", msg);
        store.commit("message/updateMessageList", obj);
      });
      socket.on("deleteComment", function (msg) {
        let obj = { commentCount: msg.commentCount, _key: msg.cardKey };
        store.commit("message/updateMessageList", obj);
      });
    });
  } else {
    router.push("/");
  }
});
watchEffect(() => {
  groupList.value.map((item: Group) => {
    if (item.toUserKey === user.value?._key) {
      store.commit("auth/setGroupItem", item);
    }
  });
});
</script>

<template>
  <router-view></router-view>
  <audio
    ref="musicRef"
    src=""
    :style="{ position: 'fixed', zIndex: -5, opacity: 0 }"
  >
    您的浏览器不支持 audio 标签。
  </audio>
</template>

<style lang="scss">
*::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

*::-webkit-scrollbar-thumb {
  background: var(--el-color-success);
  border-radius: 100px;
}
.common-color {
  color: var(--el-color-success);
}
.container {
  padding: 10px;
  box-sizing: border-box;
  .left {
    // cursor: pointer;
    .img {
      width: 30px;
      height: 30px;
    }
    .name {
      margin-left: 15px;
      font-size: 16px;
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
