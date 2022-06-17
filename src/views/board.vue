<script setup lang="ts">
import { useStore } from "@/store";
import { Search } from "@element-plus/icons-vue";
import BoardItem from "@/components/boardItem.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { BoardObj } from "@/interface/User";

const store = useStore();
const socket: any = inject("socket");
const props = defineProps<{
  type?: string;
  boardHeight?: string;
}>();
const emits = defineEmits(["close"]);
const searchList = computed(() =>
  boardList.value.filter((item) => {
    return item.title.indexOf(searchInput.value) !== -1;
  })
);
const boardList = ref<BoardObj[]>([]);
const searchVisible = ref<boolean>(false);
const searchInput = ref<string>("");
const overKey = ref<string>("");
const user = computed(() => store.state.auth.user);
const clickKey = ref<string>("");
// const page = ref<number>(1);
// const pageNumber = ref<number>(0);
onMounted(() => {
  getInfo();
  socket.on("card", function (msg) {
    searchList.value.forEach((item) => {
      if (
        (msg.receiverType === "user" &&
          msg.creatorInfo._key === item.toUserKey) ||
        (msg.receiverType === "group" && msg.receiverKey === item._key)
      ) {
        console.log("item", item);
        item.unReadNum++;
      }
    });
  });
});
// , {
//     page: page.value,
//     limit: 20,
//   }
const getInfo = async () => {
  let infoRes = (await api.request.get("receiver/board")) as ResultProps;
  if (infoRes.msg === "OK") {
    let arr1: BoardObj[] = [];
    let arr2: BoardObj[] = [];
    infoRes.data.forEach((item) => {
      if (item.top) {
        arr1.push(item);
      } else {
        arr2.push(item);
      }
    });
    boardList.value = [...arr1, ...arr2];
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
  <theader
    :headerIcon="'menu'"
    :headerTitle="$t(`Boards`)"
    v-if="type !== 'menu'"
  >
    <template #right>
      <div class="dp--center">
        <el-input
          v-if="searchVisible"
          v-model="searchInput"
          :placeholder="$t(`Enter Team Name`)"
          style="width: 50vw; margin-right: 10px"
        />
        <icon-font
          name="search"
          class="icon-point"
          style="margin-right: 15px"
          @click="searchVisible = !searchVisible"
        />
        <icon-font
          name="boardAdd"
          class="icon-point"
          @click="$router.push('/createGroup')"
        />
      </div>
    </template>
  </theader>
  <div v-if="type === 'menu'" class="board-search dp-center-center">
    <el-input
      v-model="searchInput"
      :placeholder="$t(`Enter Team Name`)"
      style="width: 90%"
    >
      <template #append> <el-button :icon="Search" /> </template
    ></el-input>
  </div>
  <!-- @scroll="scrollLoading" -->
  <div
    class="board-box dp-center-center p-5"
    :style="boardHeight ? { height: boardHeight } : {}"
  >
    <div class="board-container" v-if="searchList.length > 0">
      <div
        v-for="(item, index) in searchList"
        :key="'chat' + index"
        @mouseenter="overKey = item._key"
      >
        <div
          v-if="type === 'menu'"
          class="board-menu-item"
          @click="
            $router.push('/home/topic/' + item._key);
            emits('close');
            clickKey = item._key;
          "
          :style="{
            borderLeft: item.top
              ? '8px solid #ff6965'
              : item.webmasterInfo?._key === user?._key
              ? '8px solid #16ab78'
              : '8px solid #c8c8c8',
            backgroundColor:
              clickKey === item._key ? '#EDEDED' : 'var(--talk-item-color)',
          }"
        >
          {{ item.title }}
          <span v-if="item.webmasterInfo?.userName"
            >( {{ item.webmasterInfo?.userName }} )</span
          >
        </div>
        <board-item :item="item" :overKey="overKey" v-else />
      </div>
    </div>
    <el-empty :description="'No More'" v-else />
  </div>
</template>
<style scoped lang="scss">
.board-search {
  width: 100%;
  height: 55px;
}
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
    .board-menu-item {
      width: 100%;
      // max-height: 185px;
      // box-shadow: 0px 2px 9px 0px rgba(178, 178, 178, 0.5);
      position: relative;
      z-index: 1;
      margin-bottom: 5px;
      padding: 10px 15px;
      box-sizing: border-box;
      cursor: pointer;
      // filter: drop-shadow(0px 2px 9px rgba(178, 178, 178, 0.5));
      // border-radius: 8px;
      color: var(--el-text-color-primary);
      &:hover {
        box-shadow: 0px 4px 9px 0px var(--talk-hover-shadow);
      }
    }
  }
}
// .board-menu-box{
//   width: 100%;
// }
</style>
<style></style>
