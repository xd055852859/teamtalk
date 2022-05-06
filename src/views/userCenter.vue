<script setup lang="ts">
import Tbutton from "@/components/tbutton.vue";
import IconFont from "@/components/iconFont.vue";

import i18n from "@/language/i18n";
import { ElMessage } from "element-plus";
import setDark from "@/hooks/dark";
import { uploadImage } from "@/services/util";
import { useStore } from "@/store";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import api from "@/services/api";

import { ResultProps } from "@/interface/Common";



const store = useStore();
const emits = defineEmits(["close"]);
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
  store.commit("common/setLocale", value);
  localStorage.setItem("LANGUAGE", value);
};
const changeDark = (value: string | boolean) => {
  value = value === i18n.global.t(`text['Dark mode']`);
  setDark(value);
  store.commit("common/setDark", value);
};

const changeConfig = async () => {
  let config = {
    userAvatar: avatar.value,
    userName: userName.value,
    email: email.value,
  };
  const configRes = (await api.request.patch("user/config", {
    ...config,
  })) as ResultProps;
  if (configRes.msg === "OK") {
    ElMessage({
      message: "edit success",
      type: "success",
      duration: 1000,
    });
    userVisible.value = false;
    store.commit("auth/setUserInfo", { ...user.value, ...config });
  }
};

const chooseImg = (e) => {
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
  <div class="user-center">
    <div style="width: 100%">
      <div class="userCenter-user dp-space-center" @click="userVisible = true">
        <el-avatar fit="cover" :src="user?.userAvatar" :size="50" />
        <div class="right">
          <div class="center">{{ user?.userName }}</div>
          <div class="bottom">{{ user?.email }}</div>
        </div>
      </div>

      <div
        class="userCenter-item dp--center"
        @click="
          $router.push('/home/topic');
          emits('close');
        "
      >
        <icon-font name="note" :size="22" style="margin-right: 18px" />
        <span>Notes </span>
      </div>
      <!-- <div class="userCenter-item dp--center" @click="$router.push('/')">
    <img
      :src="dark ? headerFilterwSvg : headerFilterSvg"
      alt=""
      class="filter"
    />
    <img :src="dark ? setwSvg : setSvg" alt="" />
    <span>
      {{ $t(`icon.Filter`) }}
    </span>
  </div> -->
      <div
        class="userCenter-item dp--center"
        @click="
          $router.push('/home/partner/user');
          emits('close');
        "
      >
        <icon-font name="mate" style="margin-right: 20px" />
        <span>
          {{ $t(`icon.Mates`) }}
        </span>
      </div>
      <div
        class="userCenter-item dp--center"
        @click="
          $router.push('/home/partner/group');
          emits('close');
        "
      >
        <icon-font name="partner" :size="24" style="margin-right: 15px" />
        <span>
          {{ $t(`icon.Team`) }}
        </span>
      </div>
      <div
        class="userCenter-item dp--center"
        @click="
          $router.push('/home/trash');
          emits('close');
        "
      >
        <icon-font name="trash" :size="24" style="margin-right: 15px" />
        <span> Trash </span>
      </div>
    </div>
    <div class="user-set">
      <div class="userCenter-item dp--center" @click="setVisible = true">
        <icon-font name="set" :size="18" style="margin-right: 15px" />
        <span>
          {{ $t(`text.Setting`) }}
        </span>
      </div>
      <div class="userCenter-item dp--center">
        <icon-font name="help" :size="18" style="margin-right: 15px" />
        <span>
          {{ $t(`text.Help`) }}
        </span>
      </div>
      <div class="userCenter-item dp--center">
        <icon-font name="community" :size="18" style="margin-right: 15px" />
        <span>
          {{ $t(`text.Communication`) }}
        </span>
      </div>
      <div
        class="userCenter-item dp--center"
        @click="store.commit('auth/setLogout')"
      >
      <icon-font name="quit" :size="18" style="margin-right: 15px" />
        <span>
          {{ $t(`text['Sign out']`) }}
        </span>
      </div>
    </div>
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
.user-center {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: space-between;
  flex-wrap: wrap;
  .userCenter-user {
    width: 100%;
    height: 45px;
    margin-bottom: 45px;
    span {
      margin-right: 0px;
    }
    .right {
      width: calc(100% - 60px);
      text-align: left;
      margin-left: 20px;
      .center {
        width: 100%;
        height: 20px;
        font-size: 16px;
        margin: 10px 0px;
        line-height: 20px;
      }
      .bottom {
        width: 100%;
        height: 20px;
        font-size: 14px;
        color: #999999;
        line-height: 20px;
      }
    }
  }
  .user-set {
    width: 100%;
    font-size: 12px;
    .userCenter-item {
      height: 20px;
      margin-bottom: 10px;
      padding: 8px 0px;
      img {
        width: 18px;
        height: 18px;
        margin-right: 18px;
      }
      span {
        font-size: 14px;
      }
    }
  }
  .userCenter-item {
    width: 100%;
    height: 25px;
    margin-bottom: 15px;
    padding: 10px 0px;
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
    &:hover {
      background-color: var(--talk-hover-color);
    }
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
