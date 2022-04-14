<script setup lang="ts">
import { ElMessage } from "element-plus";
import { MoreFilled, Search } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import { Group } from "@/interface/User";
const router = useRouter();
const store = useStore();
const emits = defineEmits(["close", "chooseReceiver"]);
const groupList = computed(() => store.state.auth.groupList);
const searchList = ref<Group[]>([]);
const memberName = ref<string>("");

onMounted(() => {
  searchName("");
});
const searchName = (name: string) => {
  if (name) {
    searchList.value = groupList.value.filter((item) => {
      return item.title.indexOf(name) !== -1;
    });
  } else {
    searchList.value = [...groupList.value];
  }
};
watch(memberName, (newOld: string) => {
  searchName(newOld);
});
</script>
<template>
  <div class="contact p-5">
    <div class="header">
      To : 
    </div>
    <div class="search">
      <el-input
        v-model="memberName"
        :placeholder="$t(`form.keyword`)"
        :prefix-icon="Search"
      />
    </div>
    <div class="info">
      <div
        class="container dp-space-center contact-item"
        v-for="(item, index) in searchList"
        :key="'contact' + index"
        @click="
          emits('close');
          store.commit('message/setTalker', item);
        "
      >
        <div class="left dp--center">
          <el-avatar :size="40" :src="item.avatar" />
          <div class="name">{{ item.title }}</div>
        </div>
        <div
          class="right"
          v-if="item.receiverType === 'group'"
          @click="router.push(`/manage/${item._key}`)"
        >
          <el-icon :size="18"><more-filled /></el-icon>
        </div>
      </div>
    </div>
    <div class="button dp-space-center">
      <el-button type="primary" round @click="router.push('/invite')">{{
        $t(`surface.Invite`)
      }}</el-button>
      <el-button type="primary" round @click="router.push('/manage/create')">{{
        $t(`surface['+ Group']`)
      }}</el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.contact {
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    height: 65px;
    line-height: 65px;
    text-align: center;
  }
  .search {
    width: 100%;
    height: 45px;
  }
  .info {
    width: 100%;
    height: calc(100% - 170px);
    overflow-y: auto;
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
