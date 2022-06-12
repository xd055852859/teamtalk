<script setup lang="ts">
import { BoardObj } from "@/interface/User";
import { useStore } from "@/store";
const dayjs: any = inject("dayjs");
const store = useStore();
const props = defineProps<{
  item: BoardObj;
  type?: string;
  overKey?: string;
}>();
const user = computed(() => store.state.auth.user);
const avatarRef = ref(null);
</script>
<template>
  <!--   -->
  <div
    class="board-item"
    @click="
      !item.role && type === 'member'
        ? $router.push('/home/viewTeam/' + item._key)
        : $router.push('/home/topic/' + item._key)
    "
    :style="{
      borderLeft: item.top
        ? '8px solid #ff6965'
        : item.webmasterInfo?._key === user?._key
        ? '8px solid #16ab78'
        : '8px solid #c8c8c8',
    }"
  >
    <div class="dp-space-center">
      <div
        class="title single-to-long"
        :class="{ 'dp--center': item.receiverType === 'user' }"
      >
        {{ item.title }}
        <el-badge
          :value="item.unReadNum"
          :max="99"
          class="title-item"
          v-if="item.unReadNum > 0"
        ></el-badge>
        <div
          class="icon-point avatar-item"
          v-if="item.receiverType === 'user'"
          style="margin-left: 10px"
        >
          <img :src="item.avatar" alt="" />
        </div>
      </div>

      <div
        style="color: #9c9c9c; font-size: 14px"
        v-if="item?.newestCard?.updateTime"
      >
        {{ dayjs(item.newestCard.updateTime).toNow() }}
      </div>
    </div>
    <div
      class="avatar dp-space-center"
      ref="avatarRef"
      v-if="item.receiverType === 'group' || type === 'member'"
    >
      <div class="dp--center">
        <!-- <div class="icon-point avatar-item">
          <img :src="item.webmasterInfo?.userAvatar" alt="" />
        </div> -->
        <icon-font name="boardMemter" style="margin-right: 5px" />
        <div style="margin-right: 6px">
          {{ item.webmasterInfo?.userName }}
        </div>
        <div>等 {{ item.memberCount }} 人</div>
      </div>
      <icon-font name="boardmute" style="margin-right: 5px" v-if="item.mute" />
    </div>

    <!-- <div class="bottom dp--center" v-if="item?.newestCard?.title">
      <div class="newCard-title">
        {{ item.newestCard.creatorInfo?.userName }} 发布:
      </div>
      <div class="newCard single-to-long">{{ item.newestCard.title }}</div>
    </div> -->
    <!-- <div
      class="icon-box dp--center"
      ref="iconRef"
      v-if="item.receiverType === 'group' || type === 'member'"
    >
      <div class="dp--center" style="margin-right: 10px">
        <icon-font name="partner" :size="15" style="margin-right: 5px" />
        <span>{{ item.memberCount }}</span>
      </div>
    </div> -->
  </div>
</template>
<style scoped lang="scss">
.board-item {
  width: 100%;
  // max-height: 185px;
  // box-shadow: 0px 2px 9px 0px rgba(178, 178, 178, 0.5);
  position: relative;
  z-index: 1;
  margin-bottom: 18px;
  padding: 10px 15px;
  box-sizing: border-box;
  background-color: var(--talk-item-color);
  // filter: drop-shadow(0px 2px 9px rgba(178, 178, 178, 0.5));
  border-radius: 8px;
  color: var(--el-text-color-primary);
  &:hover {
    box-shadow: 0px 4px 9px 0px var(--talk-hover-shadow);
  }
  .title {
    max-width: calc(100% - 55px);
    height: 30px;
    font-size: 20px;
  }
  .avatar {
    min-width: 100%;
    height: 35px;
    overflow-x: auto;
    overflow-y: hidden;
    margin-top: 5px;
    color: #9c9c9c;
    font-size: 14px;
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
  }
  .bottom {
    width: 100%;
    height: calc(100% - 38px);
    color: #9c9c9c;
    font-size: 14px;
    .newCard-title {
      max-width: 90px;
    }
    .newCard {
      max-width: calc(100% - 100px);
      margin-left: 10px;
    }
  }
  .icon-box {
    width: 65px;
    z-index: 2;
    color: var(--talk-font-color-2);
    font-size: 14px;
    justify-content: flex-end;
    position: absolute;
    top: 22px;
    right: 15px;
  }
}
.avatar-item {
  width: 30px;
  height: 30px;
  margin-right: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  img {
    user-select: none;
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-user-drag: none;
  }
}
</style>
<style></style>
