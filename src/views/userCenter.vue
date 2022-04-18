<script setup lang="ts">
import { ElMessage } from "element-plus";
import i18n from "@/language/i18n";
import Tbutton from "@/components/tbutton.vue";
import setDark from "@/hooks/dark";
import { ResultProps } from "@/interface/Common";
import { uploadImage } from "@/services/util";
import { useStore } from "@/store";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import api from "@/services/api";

import setSvg from "@/assets/svg/Settings.svg";
import helpSvg from "@/assets/svg/Help.svg";
import communitySvg from "@/assets/svg/Community.svg";
import quitSvg from "@/assets/svg/Quit.svg";
import partnerSvg from "@/assets/svg/partner.svg";
import setwSvg from "@/assets/svg/Settingsw.svg";
import helpwSvg from "@/assets/svg/Helpw.svg";
import communitywSvg from "@/assets/svg/Communityw.svg";
import quitwSvg from "@/assets/svg/Quitw.svg";



const store = useStore();
const router = useRouter();
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
const themeIndex = ref<number>(0);
const setVisible = ref<boolean>(false);
const localeValue = ref<string>("");
const darkValue = ref<string>("");
onMounted(() => {
  if (user.value) {
    avatar.value = user.value?.userAvatar ? user.value.userAvatar : "";
    userName.value = user.value?.userName ? user.value.userName : "";
    email.value = user.value?.email ? user.value.email : "";
    localeValue.value = locale.value === "zh" ? "中文" : "English";
    darkValue.value = dark.value
      ? locale.value === "zh"
        ? "暗黑模式"
        : "Dark Mode"
      : locale.value === "zh"
      ? "明亮模式"
      : "Light Mode";
  }
});
const changeLanguage = (value: string) => {
  value = value === "中文" ? "zh" : "en";
  darkValue.value = dark.value
    ? value === "zh"
      ? "暗黑模式"
      : "Dark Mode"
    : value === "zh"
    ? "明亮模式"
    : "Light Mode";
  proxy.$i18n.locale = value;
  changeConfig("locale", value);
  store.commit("common/setLocale", value);
  localStorage.setItem("LANGUAGE", value);
};
const changeDark = (value: string | boolean) => {
  value = value === i18n.global.t("surface.DarkMode");
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
</script>
<template>
  <div class="userCenter-user" @click="userVisible = true">
    <el-avatar :src="user?.userAvatar" :size="100" />
    <div class="center">{{ user?.userName }}</div>
    <div class="bottom">{{ user?.email }}</div>
  </div>
  <div class="userCenter-item dp--center" @click="router.push('/partner')">
    <img :src="dark ? partnerSvg : partnerSvg" alt="" />
    <span>
      {{ $t(`surface.Partner`) }}
    </span>
  </div>
  <div class="userCenter-item dp--center" @click="setVisible = true">
    <img :src="dark ? setwSvg : setSvg" alt="" />
    <span>
      {{ $t(`surface.Settings`) }}
    </span>
  </div>
  <!-- <div class="userCenter-item dp--center" @click="changeDark(!dark)">
    <img :src="dark ? darkwSvg : lightSvg" alt="" />
    <span>
      {{ dark ? $t(`surface.DarkMode`) : $t(`surface.LightMode`) }}
    </span>
  </div>
  <div
    class="userCenter-item"
    @click="changeLanguage(locale === 'zh' ? 'en' : 'zh')"
  >
    <img
      :src="locale === 'zh' ? (dark ? zhwSvg : zhSvg) : dark ? enwSvg : enSvg"
      alt=""
    />
    <span>
      {{ $t(`surface.Language`) }}
    </span>
  </div> -->
  <div class="userCenter-item dp--center">
    <img :src="dark ? helpwSvg : helpSvg" alt="" />
    <span>
      {{ $t(`surface.Help`) }}
    </span>
  </div>
  <div class="userCenter-item dp--center">
    <img :src="dark ? communitywSvg : communitySvg" alt="" />
    <span>
      {{ $t(`surface.Community`) }}
    </span>
  </div>
  <div
    class="userCenter-item dp--center"
    @click="store.commit('auth/setLogout')"
  >
    <img :src="dark ? quitwSvg : quitSvg" alt="" />
    <span>
      {{ $t(`surface.Quit`) }}
    </span>
  </div>
  <el-dialog v-model="userVisible" :title="$t(`tip.info`)" :width="320">
    <div class="user-edit dp-center-center">
      <div class="avatar">
        <el-avatar :src="avatar" :size="150" />
        <input
          type="file"
          accept="image/*"
          @change="chooseImg"
          class="upload-img"
        />˝
      </div>

      <div class="text dp-space-center">
        {{ $t(`form.userName`) }} :
        <el-input
          class="input"
          v-model="userName"
          placeholder="enter userName"
        />
      </div>
      <div class="text dp-space-center">
        {{ $t(`form.email`) }} :
        <el-input class="input" v-model="email" placeholder="enter email" />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer dp-center-center">
        <tbutton @click="changeConfig()">Save</tbutton>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="setVisible" :title="$t(`surface.Settings`)" :width="320">
    <div class="user-edit dp-center-center">
      <div class="text dp-space-center">
        Language :
        <el-select
          v-model="localeValue"
          :placeholder="'choose language'"
          size="large"
          @change="changeLanguage"
        >
          <el-option value="中文">中文</el-option>
          <el-option value="English">English</el-option>
        </el-select>
      </div>
      <div class="text dp-space-center">
        DarkMode :
        <el-select
          v-model="darkValue"
          :placeholder="'choose mode'"
          size="large"
          @change="changeDark"
        >
          <el-option :value="$t(`surface.DarkMode`)">{{
            $t(`surface.DarkMode`)
          }}</el-option>
          <el-option :value="$t(`surface.LightMode`)"
            >{{ $t(`surface.LightMode`) }}
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
