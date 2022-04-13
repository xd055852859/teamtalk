<script setup lang="ts">
import { DArrowLeft, Check } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import api from "@/services/api";
import { Card } from "@/interface/Message";
import { ResultProps } from "@/interface/Common";
import Editor from "../components/editor.vue";
import { ElMessage } from "element-plus";
// const emits = defineEmits(["close"]);
const router = useRouter();
const route = useRoute();
const infoKey = ref<string>("");
const info = ref<Card | null>(null);
const store = useStore();
const editorRef = ref(null);

const talker = computed(() => store.state.message.talker);
const editContent = computed(() => store.state.message.editContent);
const memberList = computed(() => store.state.auth.memberList);
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
      <el-icon
        style="margin-right: 10px; cursor: pointer"
        size="20px"
        @click="
          router.push('/home');
          store.commit('message/setEditContent', null);
        "
        ><d-arrow-left /></el-icon
      >{{ $t(`surface.Info`) }}
      <div></div>
    </div>
    <div class="center" :style="{ paddingTop: infoKey ? '0px' : '30px' }">
      <editor
        :init-data="info"
        :isEdit="infoKey ? false : true"
        position="top"
      />
    </div>
    <div class="message">
      <div
        class="title common-color"
        v-if="
          (!infoKey && talker && talker.receiverType === 'group') ||
          (infoKey && info?.receiverInfo.receiverType === 'group')
        "
      >
        Broadcasting to :
      </div>
      <div
        class="img-container dp--center"
        v-if="
          (!infoKey && talker && talker.receiverType === 'group') ||
          (infoKey && info?.receiverInfo.receiverType === 'group')
        "
      >
        <el-tooltip
          v-for="(item, index) in memberList"
          :content="item.userName"
          placement="top"
        >
          <el-avatar :src="item.userAvatar" :key="'img' + index" class="img" />
        </el-tooltip>
      </div>
    </div>
    <div class="footer dp--center">
      <el-button type="primary">{{
        infoKey ? $t(`surface.Reply`) : $t(`surface.Post`)
      }}</el-button>
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
  }
  .center {
    width: 100%;
    height: calc(100% - 235px);
    border-radius: 12px;
    margin-bottom: 15px;
    overflow: auto;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
  }
  .message {
    width: 100%;
    height: 100px;
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
  }
}
</style>
<style></style>
