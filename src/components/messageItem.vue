<script setup lang="ts">
import { Card, Message } from "@/interface/Message";
import { useStore } from "@/store";
import { Group } from "@/interface/User";
import { ElMessage } from "element-plus";
import { ResultProps } from "@/interface/Common";
import Editor from "./editor/editor.vue";
import Tbutton from "./tbutton.vue";
import api from "@/services/api";
import { OnClickOutside } from "@vueuse/components";

import commentSvg from "@/assets/svg/comment.svg";
import commentwSvg from "@/assets/svg/commentw.svg";
import fullScreenSvg from "../assets/svg/fullScreen.svg";
import archiveSvg from "@/assets/svg/archive.svg";
import archivewSvg from "@/assets/svg/archivew.svg";

const store = useStore();
const props = defineProps<{ item: Message; type?: string }>();
const emits = defineEmits(["changeItem"]);
const user = computed(() => store.state.auth.user);
const dark = computed(() => store.state.common.dark);
const editKey = computed(() => store.state.message.editKey);
const editContent = computed(() => store.state.message.editContent);

const editorRef = ref(null);
const itemRef = ref(null);
const receiverRole = ref<number>(4);
const updateState = ref<boolean>(false);
const getInfo = async (key) => {
  let infoRes = (await api.request.get("card/detail", {
    cardKey: key,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    store.commit("message/setEditContent", infoRes.data);
    store.commit("message/setEditKey", key);
    receiverRole.value = infoRes.data.receiverRole;
  }
};
const filedCard = async (key) => {
  const filedRes = (await api.request.patch("card/filed", {
    cardKey: key,
    filed: false,
  })) as ResultProps;
  if (filedRes.msg === "OK") {
    ElMessage.success("unFiled Card Success");
    emits("changeItem", key);
  }
};
const postCard = async () => {
  if (editorRef.value) {
    //@ts-ignore
    editorRef.value.handlePost(
      "",
      (res) => {
        if (res.data.receiverType === "user") {
          store.commit("message/updateMessageList", res.data);
        }
      },
      true,
      true
    );
  }
};
const close = () => {
  if (
    editKey.value === props.item._key &&
    (user.value?._key === editContent?.value.creatorInfo?._key ||
      (receiverRole.value < 3 &&
        editContent.value?.receiverInfo?.receiverType === "group"))
  ) {
    console.log(updateState.value);
    if (updateState.value) {
      postCard();
    }
    store.commit("message/setEditContent", null);
    store.commit("message/setEditKey", "");
    updateState.value = false;
  }
};
</script>
<template>
  <div
    class="item"
    :style="{
      border: props.item.type === 'self' ? '1px solid #e1e1e1' : '0px',
    }"
  >
    <template
      v-if="
        editKey === props.item._key &&
        (user?._key === editContent?.creatorInfo?._key ||
          (receiverRole < 3 &&
            editContent?.receiverInfo?.receiverType === 'group'))
      "
    >
      <OnClickOutside @trigger="close">
        <Editor
          :init-data="editContent"
          :isEdit="true"
          :shake="false"
          :cardKey="editKey"
          ref="editorRef"
          @changeUpdate="updateState = true"
        />
      </OnClickOutside>
      <!-- <div class="editor-button dp--center">
          <tbutton @click.once="postCard" v-if="updateState">{{
            $t(`surface.Update`)
          }}</tbutton>
        </div> -->
    </template>
    <div v-else @click="getInfo(props.item._key)">
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
      <div class="right dp--center">
        <div
          class="dp--center icon-point"
          style="margin-right: 10px"
          @click.stop="$router.push('/info/' + props.item._key)"
        >
          <img :src="fullScreenSvg" alt="" style="width: 15px; height: 15px" />
        </div>
        <div
          class="dp--center"
          v-if="props.item?.commentCount"
          style="margin-right: 10px"
        >
          <img :src="dark ? commentwSvg : commentSvg" alt="" />{{
            props.item?.commentCount
          }}
        </div>
        <div class="dp--center" v-if="props.type === 'filed'">
          <img
            :src="dark ? archivewSvg : archiveSvg"
            alt=""
            class="icon-point"
            style="width: 20px; height: 20px"
            @click.stop="filedCard(props.item._key)"
          />
        </div>
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
  border-radius: 8px;
  color: var(--el-text-color-primary);
  &:hover {
    box-shadow: 0px 4px 9px 0px var(--talk-hover-shadow);
  }
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
  .editor-button {
    width: 100%;
    justify-content: flex-end;
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
