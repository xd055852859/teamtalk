<script setup lang="ts">
import { Close, Star } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import api from "@/services/api";
import { Card } from "@/interface/Message";
import { ResultProps } from "@/interface/Common";
import Editor from "../components/editor/editor.vue";
import { ElMessage } from "element-plus";
// const emits = defineEmits(["close"]);
const router = useRouter();
const route = useRoute();
const talker = computed(() => store.state.message.talker);
const editContent = computed(() => store.state.message.editContent);
const memberList = computed(() => store.state.auth.memberList);

const infoKey = ref<string>("");
const info = ref<Card | null>(null);
const store = useStore();
const editorRef = ref(null);
const replyInput = ref<string>("");

onMounted(() => {
  infoKey.value =
    route.params.id !== "create" ? (route.params.id as string) : "";
  if (!infoKey.value && talker.value?.receiverType === "group") {
    store.dispatch("auth/getMemberList", talker.value?._key);
  }
  if (infoKey.value) {
    getInfo();
  } else if (editContent.value) {
    info.value = { detail: editContent.value };
  }
});
const getInfo = async () => {
  let infoRes = (await api.request.get("card/detail", {
    cardKey: infoKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    info.value = infoRes.data;
    if (info.value?.receiverInfo.receiverType === "group") {
      store.dispatch("auth/getMemberList", info.value.receiverInfo._key);
    }
  }
};
const postContent = async () => {
  if (infoKey.value) {
  } else {
    if (talker.value && editorRef.value) {
      //@ts-ignore
      editorRef.value.handlePost(talker.value._key, (res) => {
        store.commit("message/updateMessageList", res.data);
      });
    } else {
      ElMessage.error("choose a receiver");
      return;
    }
  }
};
</script>
<template>
  <div class="info p-5">
    <div class="header dp-space-center">
      <div class="left dp--center">
        {{
          infoKey
            ? info?.receiverInfo && info.receiverInfo.receiverType === "user"
              ? `From : `
              : `In : `
            : `To: `
        }}
        <el-avatar
          :size="40"
          :src="infoKey ? info?.receiverInfo?.logo : talker?.avatar"
          style="margin-left: 10px"
          v-if="
            (infoKey &&
              info?.receiverInfo &&
              info.receiverInfo.receiverType === 'user') ||
            (!infoKey && talker && talker.receiverType === 'user')
          "
        />
        {{ infoKey ? info?.receiverInfo?.title : talker?.title }}
      </div>
      <div>
        <el-icon
          style="margin-right: 10px; cursor: pointer"
          size="20px"
          @click=""
        >
          <star />
        </el-icon>
        <el-icon
          style="margin-right: 10px; cursor: pointer"
          size="20px"
          @click="
            router.push('/home')
            // store.commit('message/setEditContent', null);
          "
          ><close
        /></el-icon>
      </div>
    </div>

    <div class="box">
      <div class="center">
        <editor
          :init-data="info"
          :isEdit="infoKey ? false : true"
          position="top"
        />
        <el-button
          type="primary"
          v-if="
            !infoKey ||
            (infoKey && info?.replyList && info.replyList.length > 0)
          "
          class="update-button"
          >{{ infoKey ? $t(`surface.Update`) : $t(`surface.Post`) }}</el-button
        >
      </div>

      <el-divider />
      <el-input
        v-model="replyInput"
        size="large"
        :placeholder="`Please @ ${info?.creatorInfo?.userName} view`"
      />
      <div class="footer dp--center">
        <el-button type="primary" round>{{ $t(`surface.Reply`) }}</el-button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.info {
  width: 100%;
  height: 100vh;
  background: var(--talk-bg-color);
  .header {
    width: 100%;
    height: 55px;
    .left {
    }
  }
  .box {
    width: 100%;
    height: calc(100vh - 80px);
    .center {
      min-height: 80px;
      position: relative;
      z-index: 1;
      .update-button {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 2;
      }
    }
    .message {
      width: 100%;
      height: 100px;
      margin-top: 15px;
      .title {
        width: 100%;
        height: 25px;
      }
      .img-container {
        width: 100%;
        height: 60px;
        overflow-x: auto;
        &::-webkit-scrollbar {
          height: 0px;
        }
        .img {
          flex-shrink: 0;
        }
      }
    }
    .footer {
      width: 100%;
      height: 40px;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
}
</style>
<style></style>
