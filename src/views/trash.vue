<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ResultProps } from "@/interface/Common";
import { Message } from "@/interface/Message";
import api from "@/services/api";
import MessageItem from "@/components/messageItem.vue";


const trashList = ref<Message[]>([]);
const trashPage = ref<number>(1);
const pageNumber = ref<number>(0);
const delVisible = ref<boolean>(false);
onMounted(() => {
  getTrash();
});
const getTrash = async () => {
  let trashRes = (await api.request.get("card/trash/list", {
    page: trashPage.value,
    limit: 50,
  })) as ResultProps;
  if (trashRes.msg === "OK") {
    if (trashPage.value === 1) {
      trashList.value = [];
    }
    trashList.value = [...trashList.value, ...trashRes.data];
    pageNumber.value = trashRes.pageNum as number;
  }
};
const flashTrash = (key: string) => {
  console.log(key);
  trashList.value = trashList.value.filter((item) => {
    return item._key !== key;
  });
};
const deleteTrash = async () => {
  let trashRes = (await api.request.delete(
    "card/trash/clean",
    {}
  )) as ResultProps;
  if (trashRes.msg === "OK") {
    ElMessage({
      message: "Clear All Success",
      type: "success",
      duration: 1000,
    });
    delVisible.value = false;
    trashList.value = [];
  }
};
const scrollLoading = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let clientHeight = e.target.clientHeight;
  if (
    clientHeight + scrollTop >= scrollHeight &&
    trashPage.value < pageNumber.value
  ) {
    trashPage.value++;
    getTrash();
  }
};
</script>
<template>
  <theader headerIcon="menu" headerTitle="Trash">
    <template v-slot:title></template>
    <template v-slot:right
      ><tbutton @click="delVisible = true">Dump All</tbutton></template
    >
  </theader>
  <div class="trash-box p-5" @scroll="scrollLoading">
    <div class="trash-container">
      <template v-if="trashList.length > 0">
        <div v-for="(item, index) in trashList" :key="'trash' + index">
          <message-item :item="item" :type="'trash'" @changeItem="flashTrash" />
        </div>
      </template>
      <el-empty description="No Card" v-else />
    </div>
  </div>
  <el-dialog
    v-model="delVisible"
    :title="$t(`Delete prompt`)"
    :width="300"
  >
    <span>Clear All</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="delVisible = false"  bgColor="#d1dbe5">{{
          $t(`Cancel`)
        }}</tbutton>
        <tbutton @click="deleteTrash()">{{ $t(`OK`) }}</tbutton>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.trash-box {
  width: 100%;
  height: calc(100vh - 55px);
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--talk-bg-color);

  .trash-container {
    width: 100%;
    max-width: 960px;
  }
}
</style>
<style></style>
