<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import { Group } from "@/interface/User";

const store = useStore();
const props = defineProps<{ eyeState: boolean }>();
const emits = defineEmits(["close"]);
const groupList = computed(() => store.state.auth.groupList);
const searchList = computed(() =>
  groupList.value.filter((item) => {
    return item.title.indexOf(memberName.value) !== -1;
  })
);
const memberName = ref<string>("");

const chooseTalker = (item: Group) => {
  store.commit("message/setTalker", item);
  if (props.eyeState) {
    store.commit("message/setReceiver", item);
    store.commit("message/setReceiverType", "receiver");
    store.dispatch("message/getMessageList", 1);
  }
  emits("close");
};
</script>
<template>
  <div class="contact p-5">
    <div class="search dp--center">
      <el-input
        v-model="memberName"
        :placeholder="$t(`Enter Name`)"
        :prefix-icon="Search"
      />
    </div>
    <div class="info">
      <div
        class="container dp-space-center contact-item icon-point"
        v-for="(item, index) in searchList"
        :key="'contact' + index"
        @click="chooseTalker(item)"
      >
        <div class="left dp--center">
          <el-avatar fit="cover" :size="30" :src="item.avatar" />
          <div class="name single-to-long">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.contact {
  width: 100%;
  height: 500px;
  padding: 15px 5%;
  box-sizing: border-box;
  // background: var(--talk-bg-color);
  .search {
    width: 100%;
    height: 45px;
  }
  .info {
    width: 100%;
    height: calc(100% - 45px);
    overflow-y: auto;
    margin-top: 10px;
    .contact-item {
      width: 100%;
      height: 45px;

      .left {
        width: 100%;
        .name {
          width: calc(100% - 60px);
          margin-left: 5px;
          font-size: 14px;
        }
      }
    }
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
