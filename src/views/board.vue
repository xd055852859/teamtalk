<script setup lang="ts">
import { useStore } from "@/store";
import Theader from "@/components/theader.vue";
import BoardItem from "@/components/boardItem.vue";
import IconFont from "@/components/iconFont.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { BoardObj } from "@/interface/User";

const store = useStore();
const searchList = computed(() =>
  boardList.value.filter((item) => {
    return item.title.indexOf(searchInput.value) !== -1;
  })
);
const boardList = ref<BoardObj[]>([]);
const searchVisible = ref<boolean>(false);
const searchInput = ref<string>("");
const overKey = ref<string>("");
// const page = ref<number>(1);
// const pageNumber = ref<number>(0);
onMounted(() => {
  getInfo();
});
// , {
//     page: page.value,
//     limit: 20,
//   }
const getInfo = async () => {
  let infoRes = (await api.request.get("receiver/board")) as ResultProps;
  if (infoRes.msg === "OK") {
    // infoRes.data = infoRes.data.map((item) => {
    //   if (item.moderator) {
    //     item.moderator = item.moderator.filter((item) => item.role < 3);
    //   }
    //   return item;
    // });
    boardList.value = [...boardList.value, ...infoRes.data];
  }
};
// const scrollLoading = (e: any) => {
//   //文档内容实际高度（包括超出视窗的溢出部分）
//   let scrollHeight = e.target.scrollHeight;
//   //滚动条滚动距离
//   let scrollTop = e.target.scrollTop;
//   //窗口可视范围高度
//   let clientHeight = e.target.clientHeight;
//   if (
//     clientHeight + scrollTop >= scrollHeight &&
//     page.value < pageNumber.value
//   ) {
//     let newPage = page.value + 1;
//     store.commit("message/setPage", newPage);
//     store.dispatch("message/getMessageList", newPage);
//   }
// };
</script>
<template>
  <theader headerIcon="menu" headerTitle="Boards">
    <template v-slot:title>
      <el-input
        v-if="searchVisible"
        v-model="searchInput"
        :placeholder="$t(`input['Enter Team Name']`)"
        style="width: 100%"
    /></template>
    <template v-slot:right>
      <div>
        <icon-font
          name="search"
          class="icon-point"
          style="margin-right: 10px"
          @click="searchVisible = !searchVisible"
        />
        <icon-font
          name="add"
          class="icon-point"
          @click="$router.push('/createGroup')"
        />
      </div>
    </template>
  </theader>
  <!-- @scroll="scrollLoading" -->
  <div class="board-box p-5 dp-center-center">
    <div class="board-container" v-if="searchList.length > 0">
      <div
        v-for="(item, index) in searchList"
        :key="'chat' + index"
        @mouseenter="overKey = item._key"
      >
        <board-item :item="item" :overKey="overKey"/>
      </div>
    </div>
    <el-empty :description="'No More'" v-else />
  </div>
</template>
<style scoped lang="scss">
.board-box {
  width: 100%;
  min-height: calc(100vh - 55px);
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--talk-bg-color);
  position: relative;
  z-index: 1;
  .board-container {
    width: 100%;
    height: calc(100vh - 55px);
    max-width: 960px;
  }
}
</style>
<style></style>
