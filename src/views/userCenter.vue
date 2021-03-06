<script setup lang="ts">
import i18n from "@/language/i18n";
import { ElMessage } from "element-plus";
import setDark from "@/hooks/dark";
import { uploadImage } from "@/services/util";
import { useStore } from "@/store";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import api from "@/services/api";

import { ResultProps } from "@/interface/Common";
const router = useRouter();
const store = useStore();
const dayjs: any = inject("dayjs");
const emits = defineEmits(["close"]);
const { proxy } = useCurrentInstance();
const user = computed(() => store.state.auth.user);
const locale = computed(() => store.state.common.locale);
const dark = computed(() => store.state.common.dark);
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
      value = "ja";
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
  value = value === i18n.global.t(`Dark mode`);
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
      message: i18n.global.t(`edit success`),
      type: "success",
      duration: 1000,
    });
    userVisible.value = false;
    store.commit("auth/setUserInfo", { ...user.value, ...config });
  }
};

const chooseImg = (e) => {
  let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
  uploadImage(e.target.files[0], uploadToken.value, mimeType, (url: string) => {
    avatar.value = url;
  });
};

const changeReceiver = (type: string, route: string) => {
  store.commit("message/setReceiver", null);
  store.commit("message/setReceiverType", type);
  router.push("/home/" + route);
  emits("close");
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
        case "ja":
          localeValue.value = "日本語";
          break;
        case "tc":
          localeValue.value = "繁体";
          break;
      }
      darkValue.value = dark.value
        ? i18n.global.t(`Dark mode`)
        : i18n.global.t(`Bright mode`);
      autoValue.value = localStorage.getItem("AUTO") ? true : false;
    }
  },
  { immediate: true }
);
const toUrl = (url) => {
  window.open(url);
};
watch(autoValue, (newVal) => {
  newVal
    ? localStorage.setItem("AUTO", "auto")
    : localStorage.removeItem("AUTO");
});
</script>
<template>
  <div class="user-center">
    <div style="width: 100%">
      <div class="userCenter-user dp-space-center">
        <el-avatar fit="cover" :src="user?.userAvatar" :size="50" />
        <div class="right">
          <div class="center">{{ user?.userName }}</div>
          <div class="bottom">{{ user?.email }}</div>
        </div>
        <icon-font
          name="edit"
          :size="14"
          style="margin-right: 18px"
          class="userCenter-user-edit icon-point"
          :hover="true"
          @click="userVisible = true"
        />
      </div>
      <div
        class="userCenter-item dp--center"
        @click="changeReceiver('', 'board')"
      >
        <icon-font name="board" :size="22" style="margin-right: 18px" />
        <span>{{ $t(`Boards`) }} </span>
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
          {{ $t(`Mates`) }}
        </span>
      </div>
      <!-- <div
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
      </div> -->
      <div
        class="userCenter-item dp--center"
        @click="changeReceiver('unRead', 'read')"
      >
        <icon-font name="news" :size="24" style="margin-right: 15px" />
        <span>
          <span>{{ $t(`News`) }} </span>
        </span>
      </div>
      <div
        class="userCenter-item dp--center"
        @click="changeReceiver('sent', 'sent')"
      >
        <icon-font
          name="send"
          :size="24"
          style="margin-right: 15px"
          color="#7e7e7e"
        />
        <span> {{ $t(`I Send`) }} </span>
      </div>
      <div
        class="userCenter-item dp--center"
        @click="changeReceiver('favorite', 'bookmark')"
      >
        <icon-font name="bookmark" :size="24" style="margin-right: 15px" />
        <span>
          <span>{{ $t(`BookMark`) }} </span>
        </span>
      </div>
      <!-- <div
        class="userCenter-item dp--center"
        @click="
          $router.push('/home/trash');
          emits('close');
        "
      >
        <icon-font name="trash" :size="24" style="margin-right: 15px" />
        <span> Trash </span>
      </div> -->
    </div>
    <div class="user-set">
      <div class="userCenter-item dp--center" @click="setVisible = true">
        <icon-font name="set" :size="18" style="margin-right: 15px" />
        <span>
          {{ $t(`Setting`) }}
        </span>
      </div>
      <div
        class="userCenter-item dp--center"
        @click="toUrl('https://www.wolai.com/o8uSSmzviyU6RuA4SvYPiq')"
      >
        <icon-font name="help" :size="18" style="margin-right: 15px" />
        <span>
          {{ $t(`Help`) }}
        </span>
      </div>
      <!-- <div class="userCenter-item dp--center">
        <icon-font name="community" :size="18" style="margin-right: 15px" />
        <span>
          {{ $t(`text.Communication`) }}
        </span>
      </div> -->
      <div
        class="userCenter-item dp--center"
        @click="store.commit('auth/setLogout')"
      >
        <icon-font name="quit" :size="18" style="margin-right: 15px" />
        <span>
          {{ $t(`Sign out`) }}
        </span>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="userVisible"
    :title="$t(`Information tips`)"
    :width="400"
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
        {{ $t(`User name`) }} :
        <el-input
          class="input"
          v-model="userName"
          placeholder="enter userName"
        />
      </div>
      <div class="text dp-space-center">
        {{ $t(`email`) }} :
        <el-input class="input" v-model="email" placeholder="enter email" />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer dp-center-center">
        <tbutton @click="changeConfig()">Save</tbutton>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="setVisible" :title="$t(`text.Setting`)" :width="400">
    <div class="user-edit dp-center-center">
      <div class="text dp-space-center">
        {{ $t(`Language`) }} :
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
        {{ $t(`Auto mode`) }} :
        <el-switch v-model="autoValue" active-color="#16ab78" />
      </div>
      <div class="text dp-space-center">
        {{ $t(`Dark mode`) }} :
        <el-select
          v-model="darkValue"
          :placeholder="'choose mode'"
          size="large"
          @change="changeDark"
          :disabled="autoValue"
        >
          <el-option :value="$t(`text['Dark mode']`)">{{
            $t(`Dark mode`)
          }}</el-option>
          <el-option :value="$t(`text['Bright mode']`)"
            >{{ $t(`Bright mode`) }}
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
    position: relative;
    z-index: 1;
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
    .userCenter-user-edit {
      position: absolute;
      top: -5px;
      right: -20px;
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
