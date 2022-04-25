<script setup lang="ts">
import Tbutton from "@/components/tbutton.vue";

import i18n from "@/language/i18n";
import { ElMessage } from "element-plus";
import setDark from "@/hooks/dark";
import { uploadImage } from "@/services/util";
import { useStore } from "@/store";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import api from "@/services/api";

import { ResultProps } from "@/interface/Common";

import setSvg from "@/assets/svg/Settings.svg";
import helpSvg from "@/assets/svg/Help.svg";
import communitySvg from "@/assets/svg/Community.svg";
import quitSvg from "@/assets/svg/Quit.svg";
import setwSvg from "@/assets/svg/Settingsw.svg";
import helpwSvg from "@/assets/svg/Helpw.svg";
import communitywSvg from "@/assets/svg/Communityw.svg";
import quitwSvg from "@/assets/svg/Quitw.svg";

const store = useStore();
const { proxy } = useCurrentInstance();
const user = computed(() => store.state.auth.user);
const locale = computed(() => store.state.common.locale);
const dark = computed(() => store.state.common.dark);
const theme = computed(() => store.state.common.theme);
const uploadToken = computed(() => store.state.auth.uploadToken);

const userVisible = ref<boolean>(false);
const avatar = ref<string>("");
const userName = ref<string>("");
const email = ref<string>("");
const setVisible = ref<boolean>(false);
const localeValue = ref<string>("");
const darkValue = ref<string>("");
const autoValue = ref<boolean>(false);
onMounted(() => {
  if (user.value) {
  }
});
const changeLanguage = (value: string) => {
  switch (value) {
    case "中文":
      value = "zh";
      darkValue.value = dark.value ? "黑暗模式" : "明亮模式";
      break;
    case "English":
      value = "en";
      darkValue.value = dark.value ? "Dark mode" : "Bright mode";
      break;
    case "日本語":
      value = "jp";
      darkValue.value = dark.value ? "ダークモード" : "ブライトモード";
      break;
    case "繁体":
      value = "tc";
      darkValue.value = dark.value ? "黑暗模式" : "明亮模式";
      break;
  }
  proxy.$i18n.locale = value;
  changeConfig("locale", value);
  store.commit("common/setLocale", value);
  localStorage.setItem("LANGUAGE", value);
};
const changeDark = (value: string | boolean) => {
  value = value === i18n.global.t(`text['Dark mode']`);
  setDark(value);
  changeConfig("dark", value);
  store.commit("common/setDark", value);
};
// const setTheme = (value: boolean) => {
//   let lang = value ? "zh" : "en";
//   proxy.$i18n.locale = lang;
//   changeConfig("locale", lang);
//   store.commit("common/setLocale", lang);
// };
const changeConfig = async (key?: string, value?: string | boolean) => {
  let config = {
    userAvatar: "",
    userName: "",
    email: "",
    config: {
      locale: locale.value,
      dark: dark.value,
      theme: theme.value,
    },
  };
  if (key && config?.config) {
    config.config[key] = value;
  } else {
    config.userAvatar = avatar.value;
    config.userName = userName.value;
    config.email = email.value;
  }
  const configRes = (await api.request.patch("user/config", {
    ...config,
  })) as ResultProps;
  if (configRes.msg === "OK") {
    console.log(key);
    if (!key) {
      ElMessage.success("edit success");
      userVisible.value = false;
      store.commit("auth/setUserInfo", { ...user.value, ...config });
    }
  }
};

const chooseImg = (e) => {
  console.log(e.target.files[0]);
  let mimeType = ["image/png", "image/jpeg"];
  uploadImage(e.target.files[0], uploadToken.value, mimeType, (url: string) => {
    avatar.value = url;
  });
};
watch(
  user,
  (newVal) => {
    if (newVal) {
      avatar.value = newVal.userAvatar ? newVal.userAvatar : "";
      userName.value = newVal.userName ? newVal.userName : "";
      email.value = newVal.email ? newVal.email : "";
      // localeValue.value = locale.value === "zh" ? "中文" : "English";
      switch (locale.value) {
        case "zh":
          localeValue.value = "中文";
          break;
        case "en":
          localeValue.value = "English";
          break;
        case "jp":
          localeValue.value = "日本語";
          break;
        case "tc":
          localeValue.value = "繁体";
          break;
      }
      darkValue.value = dark.value
        ? i18n.global.t(`text['Dark mode']`)
        : i18n.global.t(`text['Bright mode']`);
      autoValue.value = localStorage.getItem("AUTO") ? true : false;
    }
  },
  { immediate: true }
);
watch(autoValue, (newVal) => {
  newVal
    ? localStorage.setItem("AUTO", "auto")
    : localStorage.removeItem("AUTO");
});
</script>
<template>
  <div class="userCenter-user" @click="userVisible = true">
    <el-avatar fit="cover" :src="user?.userAvatar" :size="100" />
    <div class="center">{{ user?.userName }}</div>
    <div class="bottom">{{ user?.email }}</div>
  </div>
  <div class="userCenter-item dp--center" @click="setVisible = true">
    <img :src="dark ? setwSvg : setSvg" alt="" />
    <span>
      {{ $t(`text.Setting`) }}
    </span>
  </div>
  <div class="userCenter-item dp--center">
    <img :src="dark ? helpwSvg : helpSvg" alt="" />
    <span>
      {{ $t(`text.Help`) }}
    </span>
  </div>
  <div class="userCenter-item dp--center">
    <img :src="dark ? communitywSvg : communitySvg" alt="" />
    <span>
      {{ $t(`text.Communication`) }}
    </span>
  </div>
  <div
    class="userCenter-item dp--center"
    @click="store.commit('auth/setLogout')"
  >
    <img :src="dark ? quitwSvg : quitSvg" alt="" />
    <span>
      {{ $t(`text['Sign out']`) }}
    </span>
  </div>
  <el-dialog
    v-model="userVisible"
    :title="$t(`dialog['Information tips']`)"
    :width="320"
  >
    <div class="user-edit dp-center-center">
      <div class="avatar">
        <el-avatar fit="cover" :src="avatar" :size="150" />
        <input
          type="file"
          accept="image/*"
          @change="chooseImg"
          class="upload-img"
        />˝
      </div>

      <div class="text dp-space-center">
        {{ $t(`text['User name']`) }} :
        <el-input
          class="input"
          v-model="userName"
          placeholder="enter userName"
        />
      </div>
      <div class="text dp-space-center">
        {{ $t(`text.email`) }} :
        <el-input class="input" v-model="email" placeholder="enter email" />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer dp-center-center">
        <tbutton @click="changeConfig()">Save</tbutton>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="setVisible" :title="$t(`text.Setting`)" :width="320">
    <div class="user-edit dp-center-center">
      <div class="text dp-space-center">
        {{ $t(`text.Language`) }} :
        <el-select
          v-model="localeValue"
          :placeholder="'choose language'"
          size="large"
          @change="changeLanguage"
        >
          <el-option value="中文">中文</el-option>
          <el-option value="English">English</el-option>
          <el-option value="日本語">日本語</el-option>
          <el-option value="繁体">繁体</el-option>
        </el-select>
      </div>
      <div class="text dp-space-center">
        {{ $t(`text['Automatic mode']`) }} :
        <el-switch v-model="autoValue" active-color="#16ab78" />
      </div>
      <div class="text dp-space-center">
        {{ $t(`text['Dark mode']`) }} :
        <el-select
          v-model="darkValue"
          :placeholder="'choose mode'"
          size="large"
          @change="changeDark"
          :disabled="autoValue"
        >
          <el-option :value="$t(`text['Dark mode']`)">{{
            $t(`text['Dark mode']`)
          }}</el-option>
          <el-option :value="$t(`text['Bright mode']`)"
            >{{ $t(`text['Bright mode']`) }}
          </el-option>
        </el-select>
      </div>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
.userCenter-user {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  span {
    margin-right: 0px;
  }
  .center {
    width: 100%;
    height: 20px;
    font-size: 20px;
    margin: 10px 0px;
    line-height: 20px;
    text-align: center;
  }
  .bottom {
    width: 100%;
    height: 20px;
    font-size: 14px;
    color: #999999;
    line-height: 20px;
    text-align: center;
  }
}
.userCenter-item {
  width: 100%;
  height: 35px;
  margin-bottom: 15px;
  cursor: pointer;
  img {
    width: 25px;
    height: 25px;
    margin-right: 15px;
  }
  span {
    font-size: 18px;
    font-weight: 400;
  }
}
.user-edit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .avatar {
    position: relative;
    z-index: 1;
    cursor: pointer;
    .upload-img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 5;
      overflow: hidden;
      opacity: 0;
      cursor: pointer;
    }
  }
  .text {
    width: 100%;
    margin: 10px 0px;
    .input {
      width: calc(100% - 100px);
    }
  }
}
</style>
<style></style>
