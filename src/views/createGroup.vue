<script setup lang="ts">
import i18n from "@/language/i18n";
import api from "@/services/api";
import { ElMessage } from "element-plus";
import { store } from "@/store";
import { Search } from "@element-plus/icons-vue";
import { ResultProps } from "@/interface/Common";
import { Group } from "@/interface/User";

import chooseSvg from "@/assets/svg/choose.svg";
import unchooseSvg from "@/assets/svg/unchoose.svg";
const router = useRouter();
const groupList = computed(() => store.state.auth.groupList);
const user = computed(() => store.state.auth.user);
const memberArray = computed(() =>
  groupList.value.filter((item: Group) => {
    return item.receiverType === "user" && item.toUserKey !== user.value?._key;
  })
);
const searchList = computed(() =>
  memberArray.value.filter((item) => {
    return item.title.indexOf(memberName.value) !== -1;
  })
);
const teamKeyArray = ref<string[]>([]);
const teamName = ref<string>("");
const memberName = ref<string>("");
const chooseMember = (memberKey: string) => {
  let index = teamKeyArray.value.indexOf(memberKey);
  if (index === -1) {
    teamKeyArray.value.push(memberKey);
  } else {
    teamKeyArray.value.splice(index, 1);
  }
};
const createGroup = async () => {
  if (teamKeyArray.value.length === 0) {
    ElMessage({
      message: i18n.global.t(`tip.selectMember`),
      type: "error",
      duration: 1000,
    });
    return;
  }
  const config = {
    title: teamName.value,
    memberKeyArr: teamKeyArray.value,
  };
  const groupRes = (await api.request.post("receiver", {
    receiverType: "group",
    ...config,
  })) as ResultProps;
  if (groupRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Group created successfully']`),
      type: "success",
      duration: 1000,
    });
    router.push("/manage/" + groupRes.data._key);
    store.commit("auth/addGroupList", [groupRes.data]);
  }
};
</script>
<template>
  <theader>
    <template v-slot:title>{{ $t(`button['New Team']`) }}</template>
    <template v-slot:right><div></div></template>
  </theader>
  <div class="create p-5">
    <div class="input dp-space-center">
      <el-input
        v-model="teamName"
        size="large"
        :placeholder="$t(`input['Enter Team Name']`)"
        style="width: calc(100% - 120px)"
      />
      <tbutton style="height: 40px; padding: 0px 30px" @click="createGroup">
        {{ $t(`button.Save`) }}
      </tbutton>
    </div>
    <div class="title dp-space-center">
      {{ $t(`text['Team members']`) }}
      <el-input
        v-model="memberName"
        size="large"
        :placeholder="$t(`input['Enter Mate Name']`)"
        style="width: calc(100% - 200px)"
      >
        <template #append> <el-button :icon="Search" /> </template>
      </el-input>
    </div>

    <div class="info">
      <div
        class="container dp-space-center"
        v-for="(item, index) in searchList"
        :key="'manage' + index"
        @click="chooseMember(item.toUserKey as string)"
      >
        <div class="left dp--center">
          <el-avatar fit="cover" :size="40" :src="item.avatar" />
          <div class="name">{{ item.title }}</div>
        </div>
        <div class="right">
          <img
            :src="
              teamKeyArray.indexOf(item.toUserKey as string) !== -1 ? chooseSvg : unchooseSvg
            "
            alt=""
            style="width: 30px; height: 30px; margin-right: 10px"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.create {
  width: 100vw;
  height: calc(100vh - 55px);
  background: var(--talk-bg-color);
  .input {
    width: 100%;
    height: 50px;
  }
  .title {
    width: 100%;
    height: 45px;
    font-size: 18px;
    font-weight: 400;
    line-height: 45px;
    margin: 10px 0px;
  }
  .info {
    width: 100%;
    height: calc(100vh - 180px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
<style></style>
