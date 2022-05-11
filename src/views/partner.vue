<script setup lang="ts">
import i18n from "@/language/i18n";
import api from "@/services/api";
import { store } from "@/store";
import { ElMessage } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";
import { useDebounceFn } from "@vueuse/core";

import { ResultProps } from "@/interface/Common";
import { Group, Search } from "@/interface/User";

import groupSvg from "@/assets/svg/group.svg";
import addApplySvg from "@/assets/svg/addApply.svg";
import addApplywSvg from "@/assets/svg/addApplyw.svg";
import IconFont from "@/components/iconFont.vue";
const router = useRouter();
const route = useRoute();
const groupList = computed(() => store.state.auth.groupList);
const dark = computed(() => store.state.common.dark);
const user = computed(() => store.state.auth.user);
const partnerType = computed(() => route.params.id as string);

const partnerName = ref<string>("");
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
      return item.receiverType === partnerType.value && !item.block;
    });
    searchMoreList.value = [];
  }
};
const choosePartner = (item: Group) => {
  if (item.receiverType === "group") {
    router.push(`/manage/${item._key}`);
  } else {
    router.push(`/member/${item.toUserKey}`);
  }
};
const showMore = useDebounceFn(async () => {
  if (partnerName.value) {
    let searchRes = (await api.request.get("receiver/search", {
      keyWord: partnerName.value,
      type: partnerType.value,
    })) as ResultProps;
    if (searchRes.msg === "OK") {
      // ElMessage.success("Update Config Success");
      searchMoreList.value = [...searchRes.data];
    }
  } else {
    searchMoreList.value = [];
  }
}, 1000);
const saveMate = async (userKey: string, index: number) => {
  const saveRes = (await api.request.post("receiver", {
    receiverType: "user",
    toUserKey: userKey,
  })) as ResultProps;
  if (saveRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Friend add succeeded']`),
      type: "success",
      duration: 1000,
    });
    searchList.value.push({ ...saveRes.data });
    searchMoreList.value.splice(index, 1);
  }
};
const saveMember = async (teamKey: string, userKey: string) => {
  const groupRes = (await api.request.patch("receiver", {
    receiverKey: teamKey,
    memberKeyArr: [userKey],
  })) as ResultProps;
  if (groupRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Join the group successfully']`),

      type: "success",
      duration: 1000,
    });
    store.dispatch("auth/getGroupList");
  }
};
const joinTeam = async (key: string, index: number) => {
  const joinRes = (await api.request.post("receiver/join/apply", {
    receiverKey: key,
  })) as ResultProps;
  if (joinRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Successfully applied']`),
      type: "success",
      duration: 1000,
    });
    searchMoreList.value[index].hasApply = true;
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
  <theader
    headerIcon="menu"
    :headerTitle="route.params.id === 'user' ? 'Mates' : 'Team'"
  >
    <template v-slot:title></template>
    <template v-slot:right><div></div></template>
  </theader>
  <div class="partner p-5">
    <div class="search dp-space-center">
      <el-input
        v-model="partnerName"
        size="large"
        :placeholder="
          partnerType === 'user'
            ? $t(`input['Enter Mate Name']`)
            : $t(`input['Enter Team Name']`)
        "
        :style="
          partnerType === 'user'
            ? { width: 'calc(100% - 140px)' }
            : { width: 'calc(100% - 240px)' }
        "
      />
      <tbutton
        style="height: 40px; padding: 0px 30px"
        @click="router.push('/home/invite')"
      >
        {{ $t(`button.Invite`) }}
      </tbutton>
      <tbutton
        style="height: 40px; padding: 0px 30px"
        @click="router.push('/createGroup')"
        v-if="partnerType === 'group'"
      >
        {{ $t(`button['New Team']`) }}
      </tbutton>
    </div>
    <div class="info">
      <div
        class="container dp-space-center partner-item"
        v-for="(item, index) in searchList"
        :key="'contact' + index"
        @click="choosePartner(item)"
        style="cursor: pointer"
      >
        <div class="left dp--center">
          <el-avatar :size="40" :src="item.avatar" />
          <div class="name single-to-long">
            {{ item.title
            }}<span style="margin-left: 8px" v-if="item.memberCount"
              >( {{ item.memberCount }} )</span
            >
          </div>
        </div>
      </div>
      <el-empty :description="'No Content'" v-if="searchList.length === 0" />
      <el-divider border-style="dashed" />
      <div
        @click="moreVisible = true"
        class="more-button icon-point"
        :class="{ 'common-color': !moreVisible ? true : false }"
      >
        {{ $t(`text.More`) }}
      </div>
      <template v-if="searchMoreList.length > 0">
        <div
          class="container dp-space-center partner-item"
          v-for="(item, index) in searchMoreList"
          :key="'contact' + index"
        >
          <div class="left dp--center">
            <el-avatar
              :size="40"
              :src="partnerType === 'group' ? groupSvg : item.avatar"
            />
            <div class="name single-to-long">{{ item.title }}</div>
          </div>
          <div class="right">
            <icon-font
              name="addmate"
              :size="22"
              @click="saveMate(item.toUserKey as string, index)"
              v-if="partnerType === 'user'"
            />
            <icon-font
              name="addmember"
              :size="22"
              @click="saveMember(item._key as string, user?._key as string)"
              v-if="partnerType === 'group' && item.allowJoin"
            />
            <icon-font
              name="addmember"
              :size="22"
              @click="joinTeam(item._key as string, index)"
              v-if="
                partnerType === 'group' && !item.hasApply && !item.allowJoin
              "
            />
            <img
              :src="dark ? addApplywSvg : addApplySvg"
              v-if="partnerType === 'group' && item.hasApply && !item.allowJoin"
              alt=""
              style="width: 25px; height: 25px"
            />
          </div>
        </div>
      </template>
      <el-empty
        :description="'No More'"
        v-else-if="
          moreVisible === true && searchMoreList.length === 0 && partnerName
        "
      />
    </div>
    <div
      class="footer icon-point dp--center"
      @click="router.push('/home/block')"
    >
      查看黑名单 <el-icon style="margin-left: 10px"><arrow-right /></el-icon>
    </div>
  </div>
</template>
<style scoped lang="scss">
.partner {
  width: 100vw;
  height: calc(100vh - 55px);
  background: var(--talk-bg-color);
  max-width: 960px;
  .search {
    width: 100%;
    height: 45px;
  }
  .info {
    width: 100%;
    height: calc(100% - 95px);
    overflow-y: auto;
    margin-top: 10px;
    .more-button {
      width: 100%;
      text-align: right;
    }
    .partner-item {
      width: 100%;
      .left {
        width: calc(100% - 50px);
        .name {
          width: calc(100% - 50px);
          margin-left: 5px;
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 30px;
    color: var(--talk-font-color-2);
    font-size: 14px;
  }
}
</style>
<style></style>
