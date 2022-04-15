<script setup lang="ts">
import useClipboard from "vue-clipboard3";
import QrcodeVue from "qrcode.vue";
import { User } from "@/interface/User";
import { ResultProps } from "@/interface/Common";
import { DArrowLeft } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import api from "@/services/api";

import chooseSvg from "../assets/svg/choose.svg";
import unchooseSvg from "../assets/svg/unchoose.svg";
import { store } from "@/store";
import Tbutton from "@/components/tbutton.vue";

const { toClipboard } = useClipboard();
const user = computed(() => store.state.auth.user);

const router = useRouter();
const searchName = ref<string>("");
const memberList = ref<User[]>([]);
const memberKey = ref<string>("");
const dialogVisible = ref<boolean>(false);
const url = ref<string>("");
const activeName = ref("1");
const searchMember = async () => {
  const searchRes = (await api.request.get("user/search", {
    keyWord: searchName.value,
    filterFriend: true,
  })) as ResultProps;
  if (searchRes.msg === "OK") {
    searchRes.data.forEach((item) => {
      memberList.value.push({
        email: item.email,
        mobile: item.mobile,
        userAvatar: item.userAvatar,
        userName: item.userName,
        _key: item._key,
      });
    });
  }
};
const saveMember = async () => {
  const saveRes = (await api.request.post("receiver", {
    receiverType: "user",
    toUserKey: memberKey.value,
  })) as ResultProps;
  if (saveRes.msg === "OK") {
    ElMessage.success("add member success");
    dialogVisible.value = true;
    store.dispatch("auth/getGroupList");
    router.push("/home");
  }
};
watch(user, (newVal) => {
  if (newVal) {
    url.value = `https://ttalk.qingtime.cn/?inviteKey=${newVal._key}`;
  }
});
// const chooseMember = (key: string) => {
//   memberKey.value = key;
// //   dialogVisible.value = true;
// };
</script>
<template>
  <div class="invite p-5">
    <div class="header dp--center">
      <el-icon
        style="margin-right: 10px; cursor: pointer"
        size="20px"
        @click="router.push('/home')"
      >
        <d-arrow-left />
      </el-icon>
      {{ $t(`surface.Invite`) }}
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t(`surface.Way1`)" name="1">
        <div class="invite-item">
          <div class="title dp-space-center">
            <el-input
              v-model="searchName"
              :placeholder="$t(`form.placeholder`)"
              style="width: calc(100% - 105px)"
              @change="searchMember"
            />
            <tbutton
              
              style="height: 40px; padding: 0px 30px"
              @click="saveMember"
              :disabled="memberKey ? false : true"
            >
              {{ $t(`surface.Save`) }}
            </tbutton>
          </div>
          <div class="info">
            <div
              class="container dp-space-center"
              v-for="(item, index) in memberList"
              :key="'manage' + index"
              @click="memberKey = item._key"
            >
              <div class="left dp--center">
                <el-avatar :size="40" :src="item.userAvatar" />
                <div class="name">{{ item.userName }}</div>
              </div>
              <div class="right">
                <img
                  :src="memberKey === item._key ? chooseSvg : unchooseSvg"
                  alt=""
                  style="width: 20px; height: 20px; margin-right: 10px"
                />
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="$t(`surface.Way2`)" name="2">
        <div class="invite-item2">
          <div class="title">
            你的好友
            <span class="common-color">{{ user?.userName }}</span>
            邀请您加入TeamTalk
          </div>
          <div class="subtitle">
            {{ url }}
          </div>
          <div class="button">
            <tbutton
              
              @click="
                toClipboard(url);
                ElMessage.success('Copy Success');
              "
              >{{ $t(`surface.copy`) }}</tbutton
            >
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="$t(`surface.Way3`)" name="3">
        <div class="invite-item3 dp-center-center" v-if="url">
          <qrcode-vue :value="url" :size="250" level="H" />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <!-- <el-dialog v-model="dialogVisible" :title="$t(`form.tips`)" width="80%">
    <span>{{ $t(`form.invite`) }}</span>
    <template #footer>
      <span class="dialog-footer">
        <tbutton @click="dialogVisible = false">{{
          $t(`form.cancel`)
        }}</tbutton>
        <tbutton  @click="saveMember">{{
          $t(`form.confirm`)
        }}</tbutton>
      </span>
    </template>
  </el-dialog> -->
</template>
<style scoped lang="scss">
.invite {
  width: 100vw;
  height: 100vh;
  background: var(--talk-bg-color);
  .header {
    width: 100%;
    height: 55px;
    text-align: center;
  }
  .invite-item {
    width: 100%;
    height: calc(100vh - 208px);
    background: var(--talk-bg-color);
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
    }
    .info {
      height: calc(100% - 40px);
      margin-top: 10px;
      overflow: auto;
    }
  }
  .invite-item2 {
    width: 100%;
    height: calc(100vh - 208px);
    background: var(--talk-bg-color);
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;

    .title,
    .subtitle {
      width: 100%;
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      // margin-bottom: 20px;
    }
    .subtitle {
      color: #999999;
      font-size: 14px;
    }
    .button {
      height: 40px;
      margin-top: 10px;
      overflow: auto;
    }
  }
  .invite-item3 {
    width: 100%;
    height: calc(100vh - 208px);
    background: var(--talk-bg-color);
  }
}
</style>
<style></style>
`
