<script setup lang="ts">
import { Message } from "@/interface/Message";
import { useStore } from "@/store";
import commentSvg from "@/assets/svg/comment.svg";
import commentwSvg from "@/assets/svg/commentw.svg";
import { Group } from "@/interface/User";
const store = useStore();
const props = defineProps<{ item: Message }>();
const dark = computed(() => store.state.common.dark);
const groupList = computed(() => store.state.auth.groupList);
</script>
<template>
  <div
    class="item"
    :style="props.item.type === 'self' ? {} : { border: '0px' }"
    @click="$router.push('/info/' + item._key)"
  >
    <div
      class="title"
      :style="!props.item.summary ? { marginBottom: '0px' } : {}"
    >
      {{ props.item.title }}
    </div>
    <div
      class="center dp-space-center"
      :style="
        props.item.type === 'self' ? { 'flex-direction': 'row-reverse' } : {}
      "
    >
      <div class="right" v-if="props.item.cover">
        <img :src="props.item.cover" alt="" />
      </div>
      <div
        class="left more-to-long"
        :style="{ width: props.item.cover ? 'calc(100% - 115px)' : '100%' }"
      >
        {{ props.item.summary }}
      </div>
    </div>
    <!-- <span
      class="triangle top"
      :style="props.item.type === 'self' ? { right: '46px' } : { left: '25px' }"
    ></span>
    <span
      class="triangle1 top1"
      :style="{ right: '45px' }"
      v-if="props.item.type === 'self'"
    ></span> -->
    <div
      class="footer dp-space-center"
      :style="
        props.item.type === 'self'
          ? {
              'flex-direction': 'row-reverse',
            }
          : {}
      "
    >
      <div class="left dp--center">
        <el-avatar
          fit="cover"
          :size="25"
          :src="props.item.creatorInfo.userAvatar"
          @click.stop="$router.push(`/member/` + props.item.creatorInfo._key)"
          class="icon-point"
        />
        <div
          class="footer-subtitle common-color"
          :style="
            props.item.type === 'self'
              ? {
                  'text-align': 'right',
                }
              : {}
          "
          v-if="props.item.receiverTitle"
        >
          # {{ props.item.receiverTitle }} /
        </div>
        <div
          class="footer-title"
          :style="
            props.item.type === 'self'
              ? {
                  'text-align': 'right',
                }
              : {}
          "
        >
          <span
            @click.stop="$router.push(`/member/` + props.item.creatorInfo._key)"
            class="icon-point"
            >{{ props.item.creatorInfo.userName }}</span
          >
        </div>
      </div>
      <div
        class="right dp--center"
        v-if="props.item?.commentCount"
      >
        <img :src="dark ? commentwSvg : commentSvg" alt="" />{{
          props.item?.commentCount
        }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.item {
  width: 100%;
  // max-height: 185px;
  // box-shadow: 0px 2px 9px 0px rgba(178, 178, 178, 0.5);
  position: relative;
  z-index: 1;
  margin-top: 18px;
  padding: 15px 18px 0px 18px;
  box-sizing: border-box;
  background-color: var(--talk-item-color);
  // border: 1px solid var(--el-color-primary);
  // filter: drop-shadow(0px 2px 9px rgba(178, 178, 178, 0.5));
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  color: var(--el-text-color-primary);

  .triangle,
  .triangle1 {
    width: 0;
    height: 0;
    position: absolute;
    z-index: 1;
    border-left-width: 9px;
    border-right-width: 9px;
    border-top-width: 13px;
    border-bottom-width: 13px;
    border-style: solid;
    border-color: transparent;
    border-bottom-color: #16ab78;
  }
  .triangle {
    z-index: 2;
    border-left-width: 8px;
    border-right-width: 8px;
    border-top-width: 12px;
    border-bottom-width: 12px;
    border-bottom-color: #fff;
  }
  .title {
    width: 100%;
    min-height: 25px;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 15px;
  }
  .center {
    width: 100%;
    height: calc(100% - 38px);
    .left {
      height: 100%;
      font-size: 16px;
      line-height: 25px;
      font-size: 14px;
      color: #9c9c9c;
    }
    .right {
      width: 110px;
      height: 110px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .top {
    top: -24px;
  }
  .top1 {
    top: -26px;
  }
  .footer {
    width: 100%;
    height: 45px;
    margin-top: 10px;
    font-size: 14px;
    .left {
      .footer-title {
        margin-right: 5px;
      }
      .footer-subtitle {
        margin-right: 5px;
        font-size: 12px;
        color: var(--talk-font-color-2);
      }
    }
    .right {
      color: var(--talk-font-color-2);
      font-size: 14px;
      img {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
    }
  }
}
</style>

<style></style>
