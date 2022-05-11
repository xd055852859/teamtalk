<script setup lang="ts">
import { ElMessage } from "element-plus";
import BoardItem from "@/components/boardItem.vue";
import api from "@/services/api";
import { BoardObj } from "@/interface/User";
import { ResultProps } from "@/interface/Common";

const route = useRoute();
const boardList = ref<BoardObj[]>([]);
const overKey = ref<string>("");
const memberKey = ref<string>("");
onMounted(() => {
  memberKey.value = route.params.id as string;
  getInfo();
});

const getInfo = async () => {
  let infoRes = (await api.request.get("receiver/board/friend", {
    friendKey: memberKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    boardList.value = [...infoRes.data];
  }
};
</script>
<template>
  <theader>
    <template v-slot:title>Mate's boards</template>
  </theader>
  <div class="mateBoard-box p-5 dp-center-center">
    <div class="mateBoard-container" v-if="boardList.length > 0">
      <div
        v-for="(item, index) in boardList"
        :key="'mateBoard' + index"
        @mouseenter="overKey = item._key"
      >
        <board-item :item="item" :overKey="overKey"  type="member"/>
      </div>
    </div>
    <el-empty :description="'No More'" v-else />
  </div>
</template>
<style scoped lang="scss">
.mateBoard-box {
  width: 100%;
  min-height: calc(100vh - 55px);
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--talk-bg-color);
  .mateBoard-container {
    width: 100%;
    height: calc(100vh - 55px);
    max-width: 960px;
  }
}
</style>
<style></style>
