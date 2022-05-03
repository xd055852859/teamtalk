<script setup lang="ts">
import { ElMessage } from "element-plus";
import Theader from "@/components/theader.vue";
import { ResultProps } from "@/interface/Common";
import { Message } from "@/interface/Message";
import api from "@/services/api";
import MessageItem from "@/components/messageItem.vue";
import Tbutton from "@/components/tbutton.vue";

const trashList = ref<Message[]>([]);
const trashPage = ref<number>(1);
const delVisible = ref<boolean>(false);
onMounted(() => {
  getTrash();
});
const getTrash = async () => {
  let trashRes = (await api.request.get("card/trash/list", {
    page: trashPage.value,
    limit: 100,
  })) as ResultProps;
  if (trashRes.msg === "OK") {
    if (trashPage.value === 1) {
      trashList.value = [];
    }
    trashList.value = [...trashList.value, ...trashRes.data];
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
</script>
<template>
  <theader headerIcon="menu" headerTitle="Trash">
    <template v-slot:title></template>
    <template v-slot:right
      ><tbutton @click="delVisible = true">Dump All</tbutton></template
    >
  </theader>
  <div class="trash-box p-5">
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
    :title="$t(`dialog['Delete prompt']`)"
    :width="300"
  >
    <span>Clear All</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="delVisible = false" :disabled="true">{{
          $t(`button.Cancel`)
        }}</tbutton>
        <tbutton @click="deleteTrash()">{{ $t(`button.OK`) }}</tbutton>
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
