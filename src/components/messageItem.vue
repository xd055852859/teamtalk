<script setup lang="ts">
import Editor from "./editor/editor.vue";
import IconFont from "./iconFont.vue";

import "dayjs/locale/zh-cn";
import i18n from "@/language/i18n";
import { OnClickOutside } from "@vueuse/components";
import {
  ArrowUp,
  Star,
  StarFilled,
  MoreFilled,
  ArrowDown,
} from "@element-plus/icons-vue";
import api from "@/services/api";
import { useStore } from "@/store";
import { ElMessage } from "element-plus";

import { Message, Read } from "@/interface/Message";
import { ResultProps } from "@/interface/Common";

import fullScreenSvg from "../assets/svg/fullScreen.svg";
import fullScreenwSvg from "../assets/svg/fullScreenw.svg";
import groupSvg from "@/assets/svg/group.svg";
import Info from "@/views/info.vue";

const dayjs: any = inject("dayjs");
const store = useStore();
const router = useRouter();
const props = defineProps<{ item: Message; type?: string; overKey?: string }>();
const emits = defineEmits(["changeItem"]);
const user = computed(() => store.state.auth.user);
const dark = computed(() => store.state.common.dark);
const editKey = computed(() => store.state.message.editKey);
const editContent = computed(() => store.state.message.editContent);
const receiverType = computed(() => store.state.message.receiverType);

const iconRef = ref(null);
const infoRef = ref(null);
const receiverRole = ref<number>(4);
const readVisible = ref<boolean>(false);
const unreadVisible = ref<boolean>(false);
const readList = ref<Read[]>([]);
const unReadList = ref<Read[]>([]);
const editState = ref<boolean>(false);
const getInfo = async () => {
  let infoRes = (await api.request.get("card/detail", {
    cardKey: props.item._key,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    // let obj = { unRead: 0, _key: props.item._key };
    // // store.commit("message/updateMessageList", msg);
    // store.commit("message/updateMessageList", obj);
    store.commit("message/setEditContent", infoRes.data);
    store.commit("message/setEditKey", props.item._key);
    receiverRole.value = infoRes.data.receiverRole;
  }
};
const getReadList = async () => {
  let readRes = (await api.request.get("card/readRecord", {
    cardKey: props.item._key,
  })) as ResultProps;
  if (readRes.msg === "OK") {
    readList.value = readRes.data.hasRead.map((item) => {
      item.readTime = dayjs(item.readTime).toNow();
      console.log(item.readTime);
      return item;
    });
    unReadList.value = readRes.data.unRead.map((item) => {
      item.readTime = dayjs(item.readTime).toNow();
      return item;
    });
    readVisible.value = true;
  }
};

const filedCard = async (key) => {
  const filedRes = (await api.request.patch("card/filed", {
    cardKey: key,
    filed: false,
  })) as ResultProps;
  if (filedRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Archived successfully']`),
      type: "success",
      duration: 1000,
    });
    emits("changeItem", key);
    store.commit("message/setEditContent", null);
    store.commit("message/setEditKey", "");
  }
};
const trashCard = async (key) => {
  const trashRes = (await api.request.patch("card/recovery", {
    cardKey: key,
  })) as ResultProps;
  if (trashRes.msg === "OK") {
    ElMessage({
      message: "trash successfully",
      type: "success",
      duration: 1000,
    });
    emits("changeItem", key);
    store.commit("message/setEditContent", null);
    store.commit("message/setEditKey", "");
  }
};

const postCard = async () => {
  if (infoRef.value) {
    //@ts-ignore
    infoRef.value.postCard();
    // store.commit("message/setEditContent", null);
    // store.commit("message/setEditKey", "");
  }
};
const rePostCard = async () => {
  if (infoRef.value) {
    //@ts-ignore
    infoRef.value.rePostCard();
    store.commit("message/setEditContent", null);
    store.commit("message/setEditKey", "");
  }
};

const delMessage = async () => {
  const delRes = (await api.request.delete("message", {
    cardKey: props.item._key,
  })) as ResultProps;
  if (delRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Deleted successfully']`),
      type: "success",
      duration: 1000,
    });
    store.commit("message/delMessageList", props.item._key);
  }
};
const delSelfMessage = async () => {
  const delRes = (await api.request.delete("card", {
    cardKey: props.item._key,
  })) as ResultProps;
  if (delRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`tip['Deleted successfully']`),
      type: "success",
      duration: 1000,
    });
    store.commit("message/delMessageList", props.item._key);
  }
};
const saveUpdate = () => {
  if (
    editKey.value === props.item._key &&
    (user.value?._key === editContent.value?.creatorInfo?._key ||
      (editContent.value?.receiverRole < 3 &&
        editContent.value?.receiverInfo?.receiverType === "group"))
  ) {
    postCard();
    // store.commit("message/setEditContent", null);
    // store.commit("message/setEditKey", "");
  }
};
const favoriteCard = async (key, favorite) => {
  const postRes = (await api.request.patch("card/favorite", {
    cardKey: key,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    // ElMessage.success(i18n.global.t(`tip['Set Favourite successfully']`));
    store.commit("message/updateMessageList", {
      favorite: !favorite,
      _key: key,
    });
    // favorite.value = !favorite.value;
  }
};
const toInfo = () => {
  router.push("/info/" + props.item._key);
};
</script>
<template>
  <div
    class="item"
    @click="
      editKey !== item._key && type !== 'filed' && type !== 'trash'
        ? getInfo()
        : null
    "
  >
    <div
      class="footer-subtitle dp--center"
      v-if="item.receiverTitle && receiverType"
    >
      <el-avatar
        fit="cover"
        :size="25"
        :src="item.receiverAvatar ? item.receiverAvatar : groupSvg"
        class="icon-point"
      />
      {{ item.receiverTitle }}
    </div>
    <template v-if="editKey === item._key">
      <OnClickOutside @trigger="saveUpdate">
        <Info :cardKey="item._key" ref="infoRef" />
      </OnClickOutside>
      <!-- <div style="margin-top: 30px">
          <Editor
            :init-data="editContent"
            :isEdit="
              user?._key === editContent?.creatorInfo?._key ||
              (receiverRole < 3 &&
                editContent?.receiverInfo?.receiverType === 'group')
            "
            :shake="false"
            :cardKey="editKey"
            ref="editorRef"
            @changeUpdate="updateState = true"
          />
        </div> -->
    </template>
    <div v-else>
      <div
        class="title single-to-long"
        :style="{
          marginBottom: item.summary ? '15px' : '0px',
        }"
      >
        {{ item.title }}
      </div>
      <div
        class="center dp-space-center"
        :style="item.type === 'self' ? { 'flex-direction': 'row-reverse' } : {}"
      >
        <div class="right" v-if="item.cover">
          <img :src="item.cover" alt="" />
        </div>
        <div
          class="left more-to-long"
          :style="{ width: item.cover ? 'calc(100% - 115px)' : '100%' }"
        >
          {{ item.summary }}
        </div>
      </div>
    </div>
    <!-- :style="
        item.type === 'self'
          ? {
              'flex-direction': 'row-reverse',
            }
          : {}
      " -->
    <div class="footer dp-space-center">
      <div class="left dp--center">
        <el-avatar
          fit="cover"
          :size="20"
          :src="item.creatorInfo.userAvatar"
          @click.stop="$router.push(`/member/` + item.creatorInfo._key)"
          class="icon-point"
        />
        <div
          class="footer-title"
          :style="
            item.type === 'self'
              ? {
                  'text-align': 'right',
                }
              : {}
          "
        >
          <span
            @click.stop="$router.push(`/member/` + item.creatorInfo._key)"
            class="icon-point"
            >{{ item.creatorInfo.userName }}</span
          >
        </div>
      </div>
      <div class="right dp--center">
        <div class="dp--center" v-if="props.type === 'filed'">
          <icon-font
            name="archive"
            :size="18"
            class="icon-point"
            @click.stop="filedCard(item._key)"
          />
        </div>
        <div class="dp--center" v-if="props.type === 'trash'">
          <icon-font
            name="recover"
            :size="18"
            class="icon-point"
            @click.stop="trashCard(item._key)"
          />
        </div>

        <div
          class="icon-box dp--center"
          ref="iconRef"
          v-if="overKey === item._key"
        >
          <el-tooltip
            :content="'comment'"
            placeholder="top"
            v-if="item.unRead || item?.commentCount"
          >
            <div class="dp--center" style="margin-right: 10px">
              <el-badge :value="item.unRead">
                <icon-font name="all" :size="15" style="margin-right: 5px" />
              </el-badge>
              <span>{{ item?.commentCount ? item.commentCount : 0 }}</span>
            </div>
          </el-tooltip>
          <el-tooltip :content="'favorite'" placeholder="top">
            <el-icon
              style="margin-right: 10px"
              @click.stop="favoriteCard(item._key, item.favorite)"
              class="icon-point"
              :size="18"
            >
              <template v-if="item.favorite"> <star-filled /></template>
              <template v-else> <star /></template>
            </el-icon>
          </el-tooltip>
          <el-tooltip :content="'fullScreen'" placeholder="top">
            <div
              class="dp--center icon-point full-button"
              style="margin-right: 10px"
              @click.stop="toInfo()"
            >
              <img
                :src="dark ? fullScreenwSvg : fullScreenSvg"
                alt=""
                style="width: 12px; height: 12px"
              />
            </div>
          </el-tooltip>
          <el-tooltip :content="'more'" placeholder="top">
            <el-dropdown>
              <el-icon :size="16"><more-filled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click.stop="$router.push('/info/' + item._key)"
                    >打开</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.stop="
                      item.creatorInfo._key !== user?._key
                        ? delMessage()
                        : delSelfMessage()
                    "
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item @click.stop="getReadList"
                    >已读列表</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.stop="rePostCard"
                    v-if="receiverRole < 3"
                    >重新发布</el-dropdown-item
                  >
                  <!-- <el-dropdown-item
                    @click.stop="favoriteCard(item._key, item.favorite)"
                    >收藏</el-dropdown-item
                  > -->
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-drawer
      v-model="readVisible"
      direction="rtl"
      :size="350"
      custom-class="p0-drawer"
      :append-to-body="true"
      title="Readed"
    >
      <div class="read-box">
        <div
          class="read-item dp-space-center"
          v-for="(item, index) in readList"
          :key="'read' + index"
        >
          <div class="left dp--center">
            <el-avatar
              fit="cover"
              :size="25"
              :src="item.userAvatar"
              class="icon-point"
            />
            {{ item.userName }}
          </div>
          <div class="right dp--center">{{ item.readTime }}</div>
        </div>
        <div
          class="read-title dp--center icon-point"
          @click="unreadVisible = !unreadVisible"
        >
          <span style="margin-right: 10px">Unread</span>
          <el-icon
            ><arrow-up v-if="unreadVisible" /><arrow-down v-else
          /></el-icon>
        </div>
        <template v-if="unreadVisible">
          <div
            class="read-item dp--center"
            v-for="(item, index) in unReadList"
            :key="'unRead' + index"
          >
            <div class="left dp--center">
              <el-avatar
                fit="cover"
                :size="25"
                :src="item.userAvatar"
                class="icon-point"
              />
              {{ item.userName }}
            </div>
          </div>
        </template>
      </div>
    </el-drawer>
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
  .footer-subtitle {
    width: 100%;
    height: 30px;
    margin-bottom: 15px;
    font-size: 14px;
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
  .del-button {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    display: none;
  }
  &:hover .del-button {
    display: flex;
  }
  .icon-box {
    width: 125px;
    z-index: 2;
    color: var(--talk-font-color-2);
    font-size: 14px;
    justify-content: flex-end;
  }
  .footer {
    width: 100%;
    height: 45px;
    margin-top: 10px;
    font-size: 12px;
    color: var(--talk-font-color-2);
    .left {
      .footer-title {
        margin-right: 5px;
      }
    }
    .right {
      img {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
    }
  }
}
.read-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 15px 5%;
  box-sizing: border-box;
  .read-item {
    width: 100%;
    height: 35px;
  }
  .read-title {
    height: 35px;
    margin: 10px 0px;
    justify-content: flex-end;
  }
}
</style>

<style></style>
