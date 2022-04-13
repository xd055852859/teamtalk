<script setup lang="ts">
import { Message } from "@/interface/Message";
const props = defineProps<{ item: Message }>();
const router = useRouter();
</script>
<template>
  <div
    class="item"
    :style="
      props.item.type === 'self' ? {} : { background: '#fff', color: '#333' }
    "
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
      class="triangle bottom"
      :style="
        props.item.type === 'self'
          ? { 'border-top-color': '#87b940', right: '25px' }
          : { 'border-top-color': '#fff', left: '25px' }
      "
    ></span>
  </div>
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
        class="title"
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
</template>
<style scoped lang="scss">
.item {
  width: 100%;
  height: 185px;
  // box-shadow: 0px 2px 9px 0px rgba(178, 178, 178, 0.5);
  position: relative;
  z-index: 1;
  margin: 10px 0px;
  padding: 15px;
  box-sizing: border-box;
  border: 0px;
  // filter: drop-shadow(0px 2px 9px rgba(178, 178, 178, 0.5));
  background: var(--el-color-primary);
  color: #fff;
  border-radius: 16px;
  .triangle {
    width: 0;
    height: 0;
    position: absolute;
    z-index: 1;
    border-width: 18px;
    border-style: solid;
    border-color: transparent;
  }
  .title {
    width: 100%;
    height: 25px;
    font-size: 20px;
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
  .bottom {
    bottom: -36px;
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
      &:nth-child(2) {
        color: #c6c9ce;
      }
    }
  }
}
</style>

<style></style>
