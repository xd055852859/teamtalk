<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
import { useStore } from "@/store";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import "dayjs/locale/zh-hk";
import "dayjs/locale/ja";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import setDark from "@/hooks/dark";
import setTheme from "@/hooks/theme";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { getSearchParamValue } from "@/services/util";
import request from "@/services/api";
import strongestMusic from "@/assets/audio/strongest.mp3";
import strongMusic from "@/assets/audio/strong.mp3";
import middleMusic from "@/assets/audio/middle.mp3";

const { proxy } = useCurrentInstance();
const socket: any = inject("socket");
const dayjs: any = inject("dayjs");
const store = useStore();
const router = useRouter();

const user = computed(() => store.state.auth.user);
const locale = computed(() => store.state.common.locale);
const muteList = computed(() => store.state.auth.muteList);

const musicRef = ref(null);
const dark = computed(() => store.state.common.dark);
const theme = computed(() => store.state.common.theme);
const token = computed(() => store.state.auth.token);
const editKey = computed(() => store.state.message.editKey);

let talkKey = "";
let infoKey = "";
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
onBeforeMount(() => {
  window.addEventListener("message", handle, false);
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
  const inviteKey = getSearchParamValue(search, "inviteKey") as string;
  talkKey = getSearchParamValue(search, "talkKey") as string;
  infoKey = getSearchParamValue(search, "infoKey") as string;
  if (inviteKey) {
    localStorage.setItem("inviteKey", inviteKey);
  }
  if (token) {
    request.setToken(token);
    store.commit("auth/setToken", token);
    if (talkKey) {
      store.commit("message/setTalkKey", talkKey);
      store.commit("common/setDeviceType", "mobile");
      router.push("/createCard");
    } else if (infoKey) {
      store.commit("message/setInfoKey", infoKey);
      store.commit("common/setDeviceType", "mobile");
      router.push(`/info/${infoKey}`);
    } else {
      router.push("/home");
    }
  }
});
onMounted(() => {
  if (localStorage.getItem("AUTO")) {
    let hour = new Date().getHours() + 1;
    setDark(hour < 6 || hour >= 20);
    store.commit("common/setDark", hour < 6 || hour >= 20);
  } else {
    setDark(dark.value);
  }
  const search = window.location.search
    ? window.location.search.split("?")[1]
    : window.location.hash.split("?")[1];
  const lang = getSearchParamValue(search, "lang") as string;
  const darkTheme = getSearchParamValue(search, "dark") as string;
  if (lang) {
    localStorage.setItem("LANGUAGE", lang);
    store.commit("common/setLocale", lang);
  }
  if (darkTheme === "1") {
    localStorage.setItem("DARK", darkTheme);
    store.commit("common/setDark", true);
    setDark(true);
  } else if (darkTheme === "0") {
    localStorage.removeItem("DARK");
    store.commit("common/setDark", false);
    setDark(false);
  }
  proxy.$i18n.locale = localStorage.getItem("LANGUAGE");
  setTheme(theme.value);
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
  }
};
const addMate = async () => {
  const saveRes = (await api.request.post("receiver", {
    receiverType: "user",
    toUserKey: localStorage.getItem("inviteKey"),
  })) as ResultProps;
  if (saveRes.msg === "OK") {
    localStorage.removeItem("inviteKey");
    store.dispatch("auth/getGroupList");
  }
};
watch(
  token,
  (newVal) => {
    if (newVal) {
      init();
    } else {
      router.push("/");
    }
  },
  { immediate: true }
);
watch(user, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    if (localStorage.getItem("inviteKey")) {
      addMate();
    } else {
      store.dispatch("auth/getGroupList");
    }
    store.dispatch("auth/getUptoken");
    // store.dispatch("message/getMessageList", 1);
    socket.on("connect", () => {
      socket.emit("login", token.value);
      socket.on("card", function (msg) {
        // 1:1卡片
        if (
          msg.creatorInfo._key !== newVal._key &&
          ((msg.receiverType === "user" &&
            muteList.value.indexOf(msg.creatorInfo._key) === -1) ||
            (msg.receiverType === "group" &&
              muteList.value.indexOf(msg.receiverKey) === -1))
        ) {
          if (msg.shake) {
            //@ts-ignore
            musicRef.value.src = strongestMusic;
            //@ts-ignore
            musicRef.value.play();
          } else if (msg.receiverType === "user") {
            //@ts-ignore
            musicRef.value.src = strongMusic;
            //@ts-ignore
            musicRef.value.play();
          } else if (msg.receiverType === "group") {
            //@ts-ignore
            musicRef.value.src = middleMusic;
            //@ts-ignore
            musicRef.value.play();
          }
        }
        console.log("addCard", msg);
        if (
          msg.creatorInfo._key !== newVal._key ||
          msg.type === "recovery" ||
          msg.type === "filed"
        ) {
          store.commit("message/addMessageList", msg);
        }
      });
      socket.on("updateCard", function (msg) {
        // 1:1卡片
        // if (msg.creatorInfo._key !== user.value?._key) {
        if (
          (msg.creatorInfo._key !== newVal._key &&
            msg.receiverType === "user" &&
            muteList.value.indexOf(msg.creatorInfo._key) === -1) ||
          (msg.receiverType === "group" &&
            muteList.value.indexOf(msg.receiverKey) === -1)
        ) {
          if (msg.shake) {
            //@ts-ignore
            musicRef.value.src = strongestMusic;
            //@ts-ignore
            musicRef.value.play();
          } else if (msg.receiverType === "user") {
            //@ts-ignore
            musicRef.value.src = strongMusic;
            //@ts-ignore
            musicRef.value.play();
          } else if (msg.receiverType === "group") {
            //@ts-ignore
            musicRef.value.src = middleMusic;
            //@ts-ignore
            musicRef.value.play();
          }
        }
        // }
        console.log("updateCard", msg);
        store.commit("message/updateMessageList", msg);
      });
      socket.on("deleteCard", function (msg) {
        console.log("delCard", msg);
        store.commit("message/delMessageList", msg._key);
      });
      // socket.on("fileCard", function (msg) {
      //   console.log(msg);
      //   store.commit("message/delMessageList", msg._key);
      // });
      socket.on("addComment", function (msg) {
        console.log("addComment", msg);
        let obj = {
          ...msg,
          unRead: 1,
          commentCount: msg.commentCount - 1,
          _key: msg.cardKey,
        };
        // store.commit("message/updateMessageList", msg);
        store.commit("message/updateMessageList", obj);
        if (
          (msg?.atUser === newVal._key || msg.receiverType === "user") &&
          muteList.value.indexOf(msg.receiverKey) === -1
        ) {
          //@ts-ignore
          musicRef.value.src = strongestMusic;
          //@ts-ignore
          musicRef.value.play();
        }
      });
      socket.on("deleteComment", function (msg) {
        console.log("delComment", msg);
        let obj = { commentCount: msg.commentCount, _key: msg.cardKey };
        store.commit("message/updateMessageList", obj);
      });
    });
  }
});
watch(
  locale,
  (newVal) => {
    switch (newVal) {
      case "zh":
        dayjs.locale("zh-cn");
        break;
      case "en":
        dayjs.locale("en");
        break;
      case "jp":
        dayjs.locale("ja");
        break;
      case "tc":
        dayjs.locale("zh-hk");
        break;
    }
  },
  { immediate: true }
);
// watchEffect(() => {
//   if (user.value && messageList.value.length > 0) {
//     let messageArray: Message[] = [];
//     messageArray = messageList.value.map((item: Message) => {
//       item.type = "other";
//       if (item.creatorInfo._key === user.value?._key) {
//         item.type = "self";
//       }
//       return item;
//     });
//     store.commit("message/replaceMessageList", messageArray);
//   }
// });
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
#app {
  background: var(--talk-bg-color);
}
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
