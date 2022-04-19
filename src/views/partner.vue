<script setup lang="ts">
import { ElMessage } from "element-plus";
import Theader from "@/components/theader.vue";
import { store } from "@/store";
import api from "@/services/api";
import Tbutton from "@/components/tbutton.vue";
import { ResultProps } from "@/interface/Common";
import { Group, Search } from "@/interface/User";

import addPersonSvg from "@/assets/svg/addPerson.svg";
const router = useRouter();
const partnerName = ref<string>("");
const partnerType = ref<string>("user");
const groupList = computed(() => store.state.auth.groupList);
const searchList = ref<Group[]>([]);
const searchMoreList = ref<Search[]>([]);
const moreVisible = ref<boolean>(false);
const searchPartner = () => {
  if (partnerName.value) {
    searchList.value = groupList.value.filter((item) => {
      return (
        item.title.indexOf(partnerName.value) !== -1 &&
        item.receiverType === partnerType.value
      );
    });
    if (moreVisible.value) {
      showMore();
    }
  } else {
    searchList.value = groupList.value.filter((item) => {
      return item.receiverType === partnerType.value;
    });
    searchMoreList.value = [];
  }
};
const choosePartner = (item: Group) => {
  if (item.receiverType === "group") {
    router.push(`/manage/${item._key}`);
  } else {
    router.push(`/member/${item._key}`);
  }
};
const showMore = async () => {
  let searchRes = (await api.request.get("receiver/search", {
    keyWord: partnerName.value,
    type: partnerType.value,
  })) as ResultProps;
  if (searchRes.msg === "OK") {
    // ElMessage.success("Update Config Success");
    searchMoreList.value = [...searchRes.data];
  }
};
const saveMember = async (userKey: string, index: number) => {
  const saveRes = (await api.request.post("receiver", {
    receiverType: "user",
    toUserKey: userKey,
  })) as ResultProps;
  if (saveRes.msg === "OK") {
    ElMessage.success("add Member success");
    searchList.value.push({ ...saveRes.data });
    searchMoreList.value.splice(index, 1);
  }
};
watchEffect(() => {
  searchPartner();
});
watch(partnerType, () => {
  searchMoreList.value = [];
  moreVisible.value = false;
  partnerName.value = "";
});
</script>
<template>
  <div class="partner p-5">
    <theader
      @clickBack="
        router.push('/home');
        store.dispatch('auth/getGroupList');
      "
    >
      <template v-slot:title>
        <div class="dp-center-center icon-point">
          <div
            :style="
              partnerType === 'user'
                ? { borderBottom: `3px solid #16ab78` }
                : {}
            "
            @click="partnerType = 'user'"
          >
            {{ $t(`surface.Mate`) }}
          </div>
          <el-divider direction="vertical" />
          <div
            :style="
              partnerType === 'group'
                ? { borderBottom: `3px solid #16ab78` }
                : {}
            "
            @click="partnerType = 'group'"
          >
            {{ $t(`surface.Team`) }}
          </div>
        </div>
      </template>
    </theader>
    <div class="search dp-space-center">
      <el-input
        v-model="partnerName"
        size="large"
        :placeholder="$t(`message.partnerName`)"
        style="width: calc(100% - 140px)"
      />
      <tbutton
        style="height: 40px; padding: 0px 30px"
        @click="router.push('/createGroup')"
        v-if="partnerType === 'user'"
      >
        {{ $t(`surface.Invite`) }}
      </tbutton>
      <tbutton
        style="height: 40px; padding: 0px 30px"
        @click="router.push('/createGroup')"
        v-else
      >
        {{ $t(`surface['+ Team']`) }}
      </tbutton>
    </div>
    <div class="info">
      <div
        class="container dp-space-center contact-item"
        v-for="(item, index) in searchList"
        :key="'contact' + index"
        @click="choosePartner(item)"
        style="cursor: pointer"
      >
        <div class="left dp--center">
          <el-avatar :size="40" :src="item.avatar" />
          <div class="name">{{ item.title }}</div>
        </div>
      </div>
      <div
        @click="moreVisible = true"
        class="more-button icon-point"
        v-if="partnerName"
      >
        more
      </div>
      <template v-if="searchMoreList.length > 0">
        <div
          class="container dp-space-center contact-item"
          v-for="(item, index) in searchMoreList"
          :key="'contact' + index"
        >
          <div class="left dp--center">
            <el-avatar :size="40" :src="item.avatar" />
            <div class="name">{{ item.name }}</div>
          </div>
          <div class="right">
            <img
              :src="addPersonSvg"
              alt=""
              style="width: 20px; height: 20px"
              @click="saveMember(item._key, index)"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped lang="scss">
.partner {
  width: 100vw;
  height: 100vh;
  background: var(--talk-bg-color);
  .search {
    width: 100%;
    height: 45px;
  }
  .info {
    width: 100%;
    height: calc(100% - 120px);
    overflow-y: auto;
    margin-top: 10px;
    .more-button {
      width: 100%;
      text-align: right;
    }
  }
}
</style>
<style></style>
