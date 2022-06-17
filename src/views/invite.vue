<script setup lang="ts">
import { User } from "@/interface/User";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import api from "@/services/api";
import i18n from "@/language/i18n";
import { store } from "@/store";

import { ResultProps } from "@/interface/Common";

import addPersonSvg from "../assets/svg/addPerson.svg";
import inviteOutSvg from "../assets/svg/inviteOut.svg";
import Theader from "@/components/theader.vue";

const router = useRouter();
const searchName = ref<string>("");
const memberList = ref<User[]>([]);
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
    searchName.value = "";
  }
};
const saveMember = async (key, index) => {
  const saveRes = (await api.request.post("receiver", {
    receiverType: "user",
    toUserKey: key,
  })) as ResultProps;
  if (saveRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`Friend add succeeded`),
      type: "success",
      duration: 1000,
    });
    memberList.value.splice(index, 1);
    store.commit("auth/addGroupList",[saveRes.data]);
    // store.dispatch("auth/getGroupList");
    // router.push("/home");
  }
};
// const chooseMember = (key: string) => {
//   memberKey.value = key;
// //   dialogVisible.value = true;
// };
</script>
<template>
  <theader>
    <template v-slot:right>
      <div class="right dp--center" @click="router.push('/home/inviteOut')">
        <img :src="inviteOutSvg" alt="" style="width: 30px; height: 30px" />
      </div>
    </template>
  </theader>
  <div class="invite p-5">
    <div class="invite-item">
      <el-input
        v-model="searchName"
        size="large"
        :placeholder="$t(`Enter Name`)"
        :suffix-icon="Search"
        @change="searchMember"
      />
      <div class="info">
        <div
          class="container dp-space-center"
          v-for="(item, index) in memberList"
          :key="'manage' + index"
          @click="saveMember(item._key, index)"
        >
          <div class="left dp--center">
            <el-avatar fit="cover" :size="40" :src="item.userAvatar" />
            <div class="name">{{ item.userName }}</div>
          </div>
          <div class="right">
            <icon-font
              class="icon-point del-button"
              name="addmate"
              :size="28"
              style="margin-right: 10px"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.invite {
  width: 100vw;
  height: calc(100vh - 55px);
  background: var(--talk-bg-color);
  .invite-item {
    width: 100%;
    height: calc(100vh - 70px);
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
      .container {
        .right {
          display: none;
        }
        &:hover .right {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .right {
    cursor: pointer;
    .img {
      width: 20px;
      height: 20px;
      margin-left: 10px;
    }
  }
}
</style>
<style></style>
`
