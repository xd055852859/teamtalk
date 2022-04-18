<script setup lang="ts">
import { ElMessage } from "element-plus";
import Theader from "@/components/theader.vue";
import { store } from "@/store";
import api from "@/services/api";
import Tbutton from "@/components/tbutton.vue";
import { ResultProps } from "@/interface/Common";
import { Group } from "@/interface/User";
const router = useRouter();
const partnerName = ref<string>("");
const groupList = computed(() => store.state.auth.groupList);
const searchList = ref<Group[]>([]);

const searchPartner = () => {
  if (partnerName.value) {
    searchList.value = groupList.value.filter((item) => {
      return item.title.indexOf(partnerName.value) !== -1;
    });
  } else {
    searchList.value = [...groupList.value];
  }
};
const choosePartner = (item: Group) => {
  if (item.receiverType === "group") {
    router.push(`/manage/${item._key}`);
  } else {
    router.push(`/member/${item._key}`);
  }
};
watchEffect(() => {
  searchPartner();
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
      <template v-slot:title>Partner</template>
    </theader>
    <div class="search dp-space-center">
      <el-input
        v-model="partnerName"
        size="large"
        :placeholder="$t(`message.partnerName`)"
        style="width: calc(100% - 140px)"
        @input="searchPartner"
      />
      <tbutton
        style="height: 40px; padding: 0px 30px"
        @click="router.push('/createGroup')"
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
        style="cursor: pointer;"
      >
        <div class="left dp--center">
          <el-avatar :size="40" :src="item.avatar" />
          <div class="name">{{ item.title }}</div>
        </div>
      </div>
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
  }
}
</style>
<style></style>
