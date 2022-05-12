<script setup lang="ts">
import { BoardObj } from "@/interface/User";
import IconFont from "@/components/iconFont.vue";

import { useStore } from "@/store";

import groupSvg from "@/assets/svg/group.svg";

const router = useRouter();
const store = useStore();
const props = defineProps<{
  item: BoardObj;
  type?: string;
  overKey?: string;
}>();

const avatarRef = ref(null);

const moveAvatar = (e) => {
  //@ts-ignore
  avatarRef.value.scrollLeft += e.deltaY;
};
</script>
<template>
  <div
    class="board-item"
    @click="
      !item.role && type === 'member'
        ? $router.push('/home/viewTeam/' + item._key)
        : $router.push('/home/topic/' + item._key)
    "
  >
    <div class="title dp--center single-to-long">
      {{ item.title }}
      <el-badge
        :value="item.unReadNum"
        :max="99"
        class="title-item"
        v-if="item.unReadNum > 0"
      ></el-badge>
    </div>
    <div
      class="avatar dp--center"
      @wheel.prevent.stop="moveAvatar"
      ref="avatarRef"
    >
      <template v-if="item.receiverType === 'group' || type === 'member'">
        <div
          v-for="(avatarItem, avatarIndex) in item.moderator"
          :key="'avatar' + avatarIndex"
          class="icon-point avatar-item"
        >
          <img :src="avatarItem.userAvatar" alt="" />
        </div>
        <div style="color: #9c9c9c; font-size: 1px">
          等 {{ item.memberCount }} 人
        </div>
      </template>
      <template v-else>
        <div class="icon-point avatar-item">
          <img :src="item.avatar" alt="" />
        </div>
      </template>
    </div>

    <div class="bottom dp--center" v-if="item?.newestCard?.title">
      <div class="newCard-title">{{ item.newestCard.creatorInfo?.userName }} 发布:</div>
      <div class="newCard single-to-long">{{ item.newestCard.title }}</div>
    </div>
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
  padding: 15px;
  box-sizing: border-box;
  background-color: var(--talk-item-color);
  // border: 1px solid var(--el-color-primary);
  // filter: drop-shadow(0px 2px 9px rgba(178, 178, 178, 0.5));
  border-radius: 8px;
  color: var(--el-text-color-primary);
  &:hover {
    box-shadow: 0px 4px 9px 0px var(--talk-hover-shadow);
  }
  .title {
    width: calc(100% - 85px);
    height: 35px;
    font-size: 18px;
    .title-item {
      margin-left: 5px;
      margin-top: 5px;
    }
  }
  .avatar {
    min-width: 100%;
    height: 30px;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 10px 0px 15px 0px;

    .avatar-item {
      width: 25px;
      height: 25px;
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
</style>
<style></style>
