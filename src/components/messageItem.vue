<script setup lang="ts">
import { Message } from "@/interface/Message";
const props = defineProps<{ item: Message }>();
const router = useRouter();
</script>
<template>
  <div
    class="footer dp--center"
    :style="
      props.item.type === 'self'
        ? {
            'flex-direction': 'row-reverse',
          }
        : {}
    "
  >
    <div class="left dp--center">
      <el-avatar :size="40" :src="props.item.creatorInfo.userAvatar" />
    </div>
    <div class="right dp--center">
      <div
        class="title"
        :style="
          props.item.type === 'self'
            ? {
                'text-align': 'right',
              }
            : {}
        "
      >
        {{ props.item.creatorInfo.userName }}
      </div>
      <div
        class="title common-color"
        :style="
          props.item.type === 'self'
            ? {
                'text-align': 'right',
              }
            : {}
        "
        v-if="props.item.receiverTitle"
      >
        {{ props.item.receiverTitle }}
      </div>
    </div>
  </div>
  <div
    class="item"
    :style="props.item.type === 'self' ? {} : { border: '0px' }"
    @click="router.push('/info/' + item._key)"
  >
    <div class="title">{{ props.item.title }}</div>
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
    <span
      class="triangle top"
      :style="props.item.type === 'self' ? { right: '46px' } : { left: '25px' }"
    ></span>
    <span
      class="triangle1 top1"
      :style="{ right: '45px' }"
      v-if="props.item.type === 'self'"
    ></span>
  </div>
</template>
<style scoped lang="scss">
.item {
  width: 100%;
  max-height: 185px;
  // box-shadow: 0px 2px 9px 0px rgba(178, 178, 178, 0.5);
  position: relative;
  z-index: 1;
  margin: 10px 0px;
  padding: 15px;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid var(--el-color-primary);
  // filter: drop-shadow(0px 2px 9px rgba(178, 178, 178, 0.5));
  border-radius: 16px;
  .triangle,
  .triangle1 {
    width: 0;
    height: 0;
    position: absolute;
    z-index: 1;
    border-left-width: 12px;
    border-right-width: 12px;
    border-top-width: 16px;
    border-bottom-width: 16px;
    border-style: solid;
    border-color: transparent;
    border-bottom-color: #03c160;
  }
  .triangle {
    z-index: 2;
    border-left-width: 11px;
    border-right-width: 11px;
    border-top-width: 15px;
    border-bottom-width: 15px;
    border-bottom-color: #fff;
  }
  .title {
    width: 100%;
    height: 25px;
    font-size: 18px;
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
    top: -30px;
  }
  .top1 {
    top: -32px;
  }
}
.footer {
  width: 100%;
  height: 65px;
  margin-top: 20px;
  font-size: 14px;
  .left {
  }
  .right {
    padding-right: 10px;
    flex-wrap: wrap;
    .title {
      width: 100%;
      margin-right: 10px;
    }
  }
}
</style>

<style></style>
