<script setup lang="ts">
import { MoreFilled, Search } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import { Group } from "@/interface/User";

import addMemberSvg from "@/assets/svg/addMember.svg";
import Theader from "@/components/theader.vue";
const router = useRouter();
const store = useStore();
const emits = defineEmits(["close"]);
const groupList = computed(() => store.state.auth.groupList);
const searchList = ref<Group[]>([]);
const memberName = ref<string>("");

const searchName = () => {
  if (memberName.value) {
    searchList.value = groupList.value.filter((item) => {
      return item.title.indexOf(memberName.value) !== -1;
    });
  } else {
    searchList.value = [...groupList.value];
  }
};
watchEffect(() => {
  searchName();
});
</script>
<template>
  <div class="contact p-5">
    <theader @clickBack="" :noIcon="true">
      <template v-slot:title>{{ $t(`surface['Talk with']`) }}</template>
    </theader>
    <div class="search dp--center">
      <el-input
        v-model="memberName"
        :placeholder="$t(`form.keyword`)"
        :prefix-icon="Search"
        @input="searchName"
      />
      <!-- style="width: calc(100% - 50px)" -->
      <!-- <img
        :src="addMemberSvg"
        alt=""
        style="margin-left: 15px; width: 35px; height: 35px; cursor: pointer"
        @click="router.push('/invite')"
      /> -->
    </div>
    <div class="info">
      <div
        class="container dp-space-center contact-item icon-point"
        v-for="(item, index) in searchList"
        :key="'contact' + index"
        @click="
          store.commit('message/setTalker', item);
          emits('close');
        "
      >
        <div class="left dp--center">
          <el-avatar fit="cover" :size="40" :src="item.avatar" />
          <div class="name">{{ item.title }}</div>
        </div>
        <!-- <div
          class="right"
          v-if="item.receiverType === 'group'"
          @click="router.push(`/manage/${item._key}`)"
        >
          <el-icon :size="18"><more-filled /></el-icon>
        </div> -->
      </div>
    </div>
    <!-- <div class="button dp-space-center">
      <tbutton  round @click="router.push('/invite')">{{
        $t(`surface.Invite`)
      }}</tbutton>
      <tbutton  round @click="router.push('/manage/create')">{{
        $t(`surface['+ Group']`)
      }}</tbutton>
    </div> -->
  </div>
</template>
<style scoped lang="scss">
.contact {
  width: 100%;
  height: 100%;
  background: var(--talk-bg-color);
  .header {
    width: 100%;
    height: 45px;
    line-height: 45px;
  }
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
  .button {
    width: 100%;
    height: 35px;
    padding: 0px 15%;
    box-sizing: border-box;
    margin-top: 10px;
  }
}
</style>
<style>
.search .el-input__inner {
  border-radius: 37px;
}
</style>
