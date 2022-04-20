<script setup lang="ts">
import { User } from "@/interface/User";
import { ResultProps } from "@/interface/Common";
import { ArrowLeft, Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import api from "@/services/api";
import { store } from "@/store";

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
  }
};
const saveMember = async (key, index) => {
  const saveRes = (await api.request.post("receiver", {
    receiverType: "user",
    toUserKey: key,
  })) as ResultProps;
  if (saveRes.msg === "OK") {
    ElMessage.success("add member success");
    memberList.value.splice(index, 1);
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
  <div class="invite p-5">
    <theader
      @clickBack="
        router.push('/home');
        store.dispatch('auth/getGroupList');
      "
    >
      <template v-slot:right>
        <div class="right dp--center" @click="router.push('/inviteOut')">
          Invite Outside
          <img :src="inviteOutSvg" alt="" class="img" />
        </div>
      </template>
    </theader>
    <div class="invite-item">
      <el-input
        v-model="searchName"
        size="large"
        :placeholder="$t(`form.placeholder`)"
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
            <img
              :src="addPersonSvg"
              alt=""
              style="width: 30px; height: 30px; margin-right: 10px"
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
  height: 100vh;
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
      width: 30px;
      height: 30px;
      margin-left: 10px;
    }
  }
}
</style>
<style></style>
`
