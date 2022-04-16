<script setup lang="ts">
import { ElMessage } from "element-plus";
import Theader from "@/components/theader.vue";
import chooseSvg from "@/assets/svg/choose.svg";
import unchooseSvg from "@/assets/svg/unchoose.svg";
import { store } from "@/store";
import api from "@/services/api";
import Tbutton from "@/components/tbutton.vue";
import { ResultProps } from "@/interface/Common";
import { Group } from "@/interface/User";
const router = useRouter();
const groupList = computed(() => store.state.auth.groupList);
const teamKeyArray = ref<string[]>([]);
const teamName = ref<string>("");
const memberArray = ref<Group[]>([]);
const chooseMember = (memberKey: string) => {
  let index = teamKeyArray.value.indexOf(memberKey);
  if (index === -1) {
    teamKeyArray.value.push(memberKey);
  } else {
    teamKeyArray.value.splice(index, 1);
  }
};
const createGroup = async () => {
  const config = {
    title: teamName.value,
    memberKeyArr: teamKeyArray.value,
  };
  const groupRes = (await api.request.post("receiver", {
    receiverType: "group",
    ...config,
  })) as ResultProps;
  if (groupRes.msg === "OK") {
    ElMessage.success(`Create Group Success`);
    router.push("/home");
    store.dispatch("auth/getGroupList");
  }
};
watch(
  groupList,
  (newVal: Group[]) => {
    newVal.forEach((item: Group) => {
      if (item.receiverType === "user") {
        memberArray.value.push(item);
      }
    });
  },
  { immediate: true }
);
</script>
<template>
  <div class="create p-5">
    <theader
      @clickBack="
        router.push('/home');
        store.dispatch('auth/getGroupList');
      "
    >
      <template v-slot:title>New Team</template>
    </theader>
    <div class="input dp-space-center">
      <el-input
        v-model="teamName"
        size="large"
        :placeholder="$t(`message.teamName`)"
        style="width: calc(100% - 120px)"
      />
      <tbutton style="height: 40px; padding: 0px 30px" @click="createGroup">
        {{ $t(`surface.Save`) }}
      </tbutton>
    </div>
    <div class="title">{{ $t(`message.selectTeam`) }}</div>
    <div class="info">
      <div
        class="container dp-space-center"
        v-for="(item, index) in memberArray"
        :key="'manage' + index"
        @click="chooseMember(item._key)"
      >
        <div class="left dp--center">
          <el-avatar :size="40" :src="item.avatar" />
          <div class="name">{{ item.title }}</div>
        </div>
        <div class="right">
          <img
            :src="
              teamKeyArray.indexOf(item._key) !== -1 ? chooseSvg : unchooseSvg
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
  height: 100vh;
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
  }
  .info {
    width: 100%;
    height: calc(100vh - 160px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
<style></style>
