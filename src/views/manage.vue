<script setup lang="ts">
import { ArrowDown, ArrowRight } from "@element-plus/icons-vue";
import { useStore } from "@/store";
import { Message } from "@/interface/Message";
import MessageItem from "@/components/messageItem.vue";
import i18n from "@/language/i18n";

import chooseSvg from "@/assets/svg/choose.svg";
import unchooseSvg from "@/assets/svg/unchoose.svg";
import groupSvg from "@/assets/svg/group.svg";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { ElMessage } from "element-plus";
import { Group, Member } from "@/interface/User";

const router = useRouter();
const route = useRoute();
const store = useStore();

const groupList = computed(() => store.state.auth.groupList);
const user = computed(() => store.state.auth.user);

const memberArray = computed(() =>
  groupList.value.filter((item) => {
    return (
      item.receiverType === "user" &&
      memberKeyArray.value.indexOf(item.toUserKey as string) === -1
    );
  })
);
const groupKeyArray = computed(() =>
  Array.from(
    groupList.value.filter((item: Group) => {
      return item.toUserKey;
    }),
    ({ toUserKey }) => toUserKey
  )
);
const memberKeyArray = computed(() =>
  memberList.value.map((item: Member) => {
    return item._key;
  })
);
const adminArray = computed(() =>
  memberList.value.filter((item: Member) => {
    return item.role === 1;
  })
);
const teamName = ref<string>("");
const avatar = ref<string>("");
const adminAvatar = ref<string>("");
const avatarVisible = ref<boolean>(false);
const avatarList = ref<any>([]);
const memberList = ref<Member[]>([]);
const followList = ref<Member[]>([]);
const groupRole = ref<number>(0);
const avatarTotal = ref<number>(0);
const teamKey = ref<string>("");
const teamKeyArray = ref<string[]>([]);

const exitVisible = ref<boolean>(false);
const memberVisible = ref<boolean>(false);
const followVisible = ref<boolean>(false);
const delVisible = ref<boolean>(false);
const disbandVisible = ref<boolean>(false);
const isPublic = ref<boolean>(false);
const allowJoin = ref<boolean>(false);
const isMute = ref<boolean>(false);
const isTop = ref<boolean>(false);

const isBlock = ref<boolean>(false);
const adminVisible = ref<boolean>(false);
const filedVisible = ref<boolean>(false);
const filedTotal = ref<number>(0);
const trashVisible = ref<boolean>(false);
const trashTotal = ref<number>(0);
const followerCount = ref<number>(0);
const avatarPage = ref<number>(1);
const filedPage = ref<number>(1);
const trashPage = ref<number>(1);
const applyArray = ref<Member[]>([]);
const filedArray = ref<Message[]>([]);
const trashArray = ref<Message[]>([]);
const delItem = ref<{ item: Member; index: number; type: string } | null>(null);
const webmasterInfo = ref<Member>();
const roleArray = ref<string[]>([]);
const moreIndex = ref<number>(5);
const moreVisible = ref<boolean>(true);
const clearVisible = ref<boolean>(false);
onMounted(() => {
  teamKey.value = route.params.id as string;
   roleArray.value = [
    i18n.global.t(`Owner`),
    i18n.global.t(`Admin`),
    i18n.global.t(`Editer`),
    i18n.global.t(`Writer`),
    i18n.global.t(`Follower`),
  ];
  getInfo();
});
const getInfo = async () => {
  let infoRes = (await api.request.get("receiver/info", {
    receiverKey: teamKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    teamName.value = infoRes.data.title;
    avatar.value = infoRes.data.avatar;
    allowJoin.value = infoRes.data.allowJoin;
    isPublic.value = infoRes.data.isPublic;
    isMute.value = infoRes.data.mute;
    isBlock.value = infoRes.data.block;
    isTop.value = infoRes.data.top;
    memberList.value = infoRes.data.moderator;
    applyArray.value = infoRes.data.applyList;
    followerCount.value = infoRes.data.followerCount;
    groupRole.value = infoRes.data.role;
    webmasterInfo.value = infoRes.data.webmasterInfo;
  }
};

const getFollowInfo = async () => {
  let infoRes = (await api.request.get("receiver/member/list", {
    receiverKey: teamKey.value,
    follower: 1,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    followList.value = infoRes.data.memberList;
  }
};
const applyMember = async (key: string, state: boolean, index: number) => {
  const applyRes = (await api.request.patch("receiver/join/verify", {
    receiverKey: teamKey.value,
    memberKey: key,
    verifyResult: state,
  })) as ResultProps;
  if (applyRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`Audit successful`),
      type: "success",
      duration: 1000,
    });
    applyArray.value.splice(index, 1);
    if (state) {
      store.dispatch("auth/getMemberList", teamKey.value);
    }
  }
};
const saveGroup = async (type, done?: any) => {
  let config: any = {};
  switch (type) {
    case "name":
      if (!teamName.value) {
        ElMessage({
          message: i18n.global.t(`Enter Team Name`),
          type: "error",
          duration: 1000,
        });
        return;
      }
      config.title = teamName.value;
      break;
    case "member":
      if (teamKey.value.length === 0) {
        return;
      }
      config.memberKeyArr = teamKeyArray.value;
      break;
    case "public":
      config.isPublic = isPublic.value;
      break;
    case "join":
      config.allowJoin = allowJoin.value;
      break;
  }
  const groupRes = (await api.request.patch("receiver", {
    receiverKey: teamKey.value,
    ...config,
  })) as ResultProps;
  if (groupRes.msg === "OK") {
    if (type === "name") {
      ElMessage({
        message: i18n.global.t(`Update group succeeded`),
        type: "success",
        duration: 1000,
      });
    } else if (type === "member") {
      followList.value = [...followList.value, ...groupRes.data];
      followerCount.value++;
    }
    store.commit("auth/updateGroupList", {
      _key: teamKey.value,
      ...config,
    });
    if (done) {
      done();
    }
  }
};
const changeRole = async (
  item: Member,
  index: number,
  role: number,
  type?: string
) => {
  if (item.role < groupRole.value) {
    ElMessage({
      message: "Error Role",
      type: "error",
      duration: 1000,
    });
    return;
  }
  let roleRes = (await api.request.patch("receiver/member/role", {
    receiverKey: teamKey.value,
    memberKey: item._key,
    role: role,
  })) as ResultProps;
  if (roleRes.msg === "OK") {
    if (type) {
      item.role = role;
      memberList.value.push(item);
      followList.value.splice(index, 1);
      followerCount.value--;
    } else {
      if (role < 4) {
        memberList.value[index].role = role;
      } else {
        item.role = role;
        followList.value.push(item);
        memberList.value.splice(index, 1);
        followerCount.value++;
      }
    }
  }
};
const chooseMember = (item: Group) => {
  let index = teamKeyArray.value.indexOf(item.toUserKey as string);
  if (index === -1) {
    teamKeyArray.value.push(item.toUserKey as string);
  } else {
    teamKeyArray.value.splice(index, 1);
  }
};
const saveMember = async (userKey: string) => {
  const saveRes = (await api.request.post("receiver", {
    receiverType: "user",
    toUserKey: userKey,
  })) as ResultProps;
  if (saveRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`Successfully added team members`),
      type: "success",
      duration: 1000,
    });
    store.dispatch("auth/getGroupList");
  }
};
const delMember = async (item: Member, index: number, type: string) => {
  const delRes = (await api.request.delete("receiver/member", {
    receiverKey: teamKey.value,
    memberKey: item._key,
  })) as ResultProps;
  if (delRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`Group members deleted successfully`),
      type: "success",
      duration: 1000,
    });
    if (type === "member") {
      memberList.value.splice(index, 1);
    } else {
      followList.value.splice(index, 1);
      followerCount.value--;
    }
    delVisible.value = false;
    delItem.value = null;
  }
};
const changeModerator = async (item) => {
  const changeRes = (await api.request.patch("receiver/webmaster", {
    receiverKey: teamKey.value,
    webmasterKey: item._key,
  })) as ResultProps;
  if (changeRes.msg === "OK") {
    ElMessage({
      message: "Change Moderator successfully",
      type: "success",
      duration: 1000,
    });
    adminVisible.value = false;
    webmasterInfo.value = { ...item };
  }
};
// const getFiledInfo = async () => {
//   let infoRes = (await api.request.get("card/filed/list", {
//     receiverKey: teamKey.value,
//     page: filedPage.value,
//     limit: 5,
//   })) as ResultProps;
//   if (infoRes.msg === "OK") {
//     if (filedPage.value === 1) {
//       filedArray.value = [];
//     }
//     filedArray.value = [...filedArray.value, ...infoRes.data];
//     filedTotal.value = infoRes.total as number;
//   }
// };
// const scrollFiled = (e: any) => {
//   //文档内容实际高度（包括超出视窗的溢出部分）
//   let scrollHeight = e.target.scrollHeight;
//   //滚动条滚动距离
//   let scrollTop = e.target.scrollTop;
//   //窗口可视范围高度
//   let height = e.target.clientHeight;
//   if (
//     height + scrollTop >= scrollHeight &&
//     filedArray.value.length < filedTotal.value
//   ) {
//     filedPage.value++;
//     getFiledInfo();
//   }
// };
const getTrashInfo = async () => {
  let infoRes = (await api.request.get("card/trash/list", {
    receiverKey: teamKey.value,
    page: trashPage.value,
    limit: 5,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    if (trashPage.value === 1) {
      trashArray.value = [];
    }
    trashArray.value = [...trashArray.value, ...infoRes.data];
    trashTotal.value = infoRes.total as number;
  }
};
const scrollTrash = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    trashArray.value.length < trashTotal.value
  ) {
    trashPage.value++;
    console.log(trashPage.value);
    getTrashInfo();
  }
};
// const flashFiled = (key: string) => {
//   filedArray.value = filedArray.value.filter((item) => {
//     return item._key !== key;
//   });
// };
const flashTrash = (key: string) => {
  trashArray.value = trashArray.value.filter((item) => {
    return item._key !== key;
  });
};
const deleteTrash = async () => {
  let trashRes = (await api.request.delete("card/trash/clean", {
    receiverKey: teamKey.value,
  })) as ResultProps;
  if (trashRes.msg === "OK") {
    ElMessage({
      message: "Clear All Success",
      type: "success",
      duration: 1000,
    });
    clearVisible.value = false;
    trashArray.value = [];
  }
};
const changeConfig = async () => {
  let infoRes = (await api.request.patch("receiver/status", {
    receiverKey: teamKey.value,
    mute: isMute.value,
    top: isTop.value,
    block: isBlock.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`Update group succeeded`),
      type: "success",
      duration: 1000,
    });
    if (!isMute.value) {
      store.commit("auth/delMuteList", teamKey.value);
    } else {
      store.commit("auth/addMuteList", teamKey.value);
    }
  }
};
const getAvatarList = async () => {
  let avatarRes = (await api.request.get(
    "",
    {
      page: avatarPage.value,
      limit: 200,
      order: "asc",
      sortField: "createTime",
    },
    false,
    "https://icondata.qingtime.cn/icon"
  )) as ResultProps;
  // let res: any = await api.thirdApi.getThirdRandomPng(page);
  if (avatarRes.msg === "OK") {
    if (avatarPage.value === 1) {
      avatarList.value = [];
    }
    avatarList.value = [...avatarList.value, ...avatarRes.data.reverse()];
    avatarTotal.value = avatarRes.totalNum as number;
  }
};
const scrollAvatar = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    avatarList.value.length < avatarTotal.value
  ) {
    avatarPage.value = avatarPage.value + 1;
    getAvatarList();
  }
};
const exitGroup = async () => {
  const exitRes = (await api.request.delete("receiver/exit", {
    receiverKey: teamKey.value,
  })) as ResultProps;
  if (exitRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`Quit the group successfully`),
      type: "success",
      duration: 1000,
    });
    store.dispatch("auth/getGroupList", "delete");
    router.push("/home");
  }
};
const disbandGroup = async () => {
  const exitRes = (await api.request.delete("receiver", {
    receiverKey: teamKey.value,
  })) as ResultProps;
  if (exitRes.msg === "OK") {
    ElMessage({
      message: "disband Group success",
      type: "success",
      duration: 1000,
    });
    store.dispatch("auth/getGroupList", "delete");
    router.push("/home");
  }
};
</script>
<template>
  <theader @clickBack="router.push('/home/topic/' + teamKey)" clickState>
    <template v-slot:title>
      {{ teamName }}
    </template>
  </theader>
  <div class="manage p-5">
    <template v-if="applyArray && applyArray.length > 0 && groupRole < 2">
      <div class="title dp-space-center">
        {{ $t(`Join`) }}
      </div>
      <div class="info">
        <div
          class="container dp-space-center manage-item"
          v-for="(item, index) in applyArray"
          :key="'manage' + index"
        >
          <div class="left dp--center">
            <el-avatar fit="cover" :size="40" :src="item.userAvatar" />
            <div class="name">{{ item.userName }}</div>
          </div>
          <div class="right dp--center">
            <icon-font
              class="icon-point"
              name="allow"
              :size="22"
              color="#16ab78"
              style="margin-right: 10px"
              @click="applyMember(item._key, true, index)"
            />
            <icon-font
              class="icon-point"
              name="reject"
              :size="22"
              color="#F56C6C"
              @click="applyMember(item._key, false, index)"
            />
          </div>
        </div>
      </div>
    </template>
    <div class="title dp-space-center">
      {{ $t(`Members`) }}  {{ ` ( ${memberList.length} ) ` }}
      <!-- <div class="dp--center icon-point">
        <icon-font name="addmember" :size="25" @click="memberVisible = true" />
      </div> -->
      <tbutton @click="memberVisible = true" style="height: 30px">
        {{ $t(`Add Member`) }}
      </tbutton>
    </div>
    <div class="info">
      <div
        class="container dp-space-center manage-item"
        v-for="(item, index) in memberList.slice(0, moreIndex)"
        :key="'manage' + index"
      >
        <div class="left dp--center">
          <el-avatar fit="cover" :size="40" :src="item.userAvatar" />
          <div class="name">{{ item.userName }}</div>
        </div>
        <div class="right dp--center">
          <!-- <div class="dp--center">
            <span style="margin-right: 10px">{{
              $t(`text['${roleArray[item.role]}']`)
            }}</span>
            <el-icon v-if="groupRole < 2 && item._key !== user?._key">
              <arrow-down />
            </el-icon>
          </div> -->

          <el-popover
            :width="50"
            ref="popoverRef"
            trigger="click"
            :disabled="
              !(groupRole < 2 && item._key !== user?._key) ||
              groupRole > item.role
            "
          >
            <template #reference>
              <div class="manage-role dp--center">
                <span style="margin-right: 10px">
                  {{ roleArray[item.role] }}
                </span>
                <el-icon v-if="groupRole < 2 && item._key !== user?._key">
                  <arrow-down />
                </el-icon>
              </div>
            </template>
            <div class="role-container">
              <div class="role-item" v-if="groupRole === 0">{{ $t(`Owner`) }}</div>
              <div class="role-item" @click="changeRole(item, index, 1)">
                {{ $t(`Admin`) }}
              </div>
              <div class="role-item" @click="changeRole(item, index, 2)">
                {{ $t(`Editer`) }}
              </div>
              <div class="role-item" @click="changeRole(item, index, 3)">
               {{ $t(`Writer`) }} 
              </div>
              <div class="role-item" @click="changeRole(item, index, 4)">
                {{ $t(`Follower`) }} 
              </div>
              <el-divider />
              <div
                class="role-item"
                @click="
                  delItem = {
                    item: item,
                    index: index,
                    type: 'member',
                  };
                  delVisible = true;
                "
              >
                {{ $t(`Delete`) }}
              </div>
            </div>
          </el-popover>
          <div style="width: 20px; height: 20px; margin-left: 10px">
            <el-tooltip
              :content="$t(`Mates`)"
              placement="top"
              v-if="
                groupKeyArray.indexOf(item._key) === -1 &&
                item._key !== user?._key
              "
            >
              <icon-font
                class="icon-point del-button"
                name="addmate"
                :size="20"
                @click="saveMember(item._key)"
              />
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div
      @click="
        moreVisible = false;
        moreIndex = memberList.length + 1;
      "
      class="more-button icon-point p-5 common-color"
      v-if="memberList.length > 5 && moreVisible"
    >
      {{ $t(`More`) }}
    </div>
    <div
      class="title dp-space-center"
      @click="
        followVisible = true;
        getFollowInfo();
      "
    >
      <span
        >{{ $t(`Follower`) }} {{ ` ( ${followerCount < 0 ? 0 : followerCount} ) ` }}</span
      >
      <el-icon><arrow-right /></el-icon>
    </div>
    <el-divider />
    <template v-if="groupRole < 2">
      <div class="manage-text dp-space-center">
        <span>{{ $t(`Team Name `) }} :</span>
        <el-input
          v-model="teamName"
          placeholder="请输入小组名"
          style="width: calc(100% - 150px)"
          @change="saveGroup('name')"
        />
      </div>
      <!-- <div
        class="manage-text dp-space-center icon-point"
        @click="
          avatarVisible = true;
          getAvatarList();
        "
      >
        <span>Avatar :</span>
        <div class="dp--center">
          <el-avatar
            fit="cover"
            :size="30"
            :src="avatar ? avatar : groupSvg"
            class="icon-point"
          />
          <el-icon><arrow-right /></el-icon>
        </div>
      </div> -->
      <div
        class="manage-text dp-space-center icon-point"
        @click="groupRole === 0 ? (adminVisible = true) : ''"
      >
        <span>{{ $t(`Moderator`) }} :</span>
        <div class="dp--center">
          <el-avatar
            fit="cover"
            :size="30"
            :src="webmasterInfo?.userAvatar"
            class="icon-point"
          />
          <el-icon v-if="groupRole === 0"><arrow-right /></el-icon>
        </div>
      </div>
      <!-- <div
        class="manage-text dp-space-center icon-point"
        @click="
          filedVisible = true;
          getFiledInfo();
        "
      >
        <span>{{ $t(`icon.Archive`) }} :</span>
        <el-icon><arrow-right /></el-icon>
      </div> -->
      <div
        class="manage-text dp-space-center icon-point"
        @click="
          trashVisible = true;
          getTrashInfo();
        "
      >
        <span>{{ $t(`Trash`) }} :</span>
        <el-icon><arrow-right /></el-icon>
      </div>
      <div class="manage-text dp-space-center">
        <span>{{ $t(`Public Team`) }} :</span>
        <el-switch
          active-color="#16ab78"
          v-model="isPublic"
          @change="saveGroup('public')"
        />
      </div>
      <div class="manage-text dp-space-center">
        <span>{{ $t(`Open  Join`) }} :</span>
        <el-switch
          active-color="#16ab78"
          v-model="allowJoin"
          @change="saveGroup('join')"
        />
      </div>
      <el-divider />
    </template>

    <div class="manage-text dp-space-center">
      <span>{{ $t(`Mute`) }} :</span>
      <el-switch
        active-color="#16ab78"
        v-model="isMute"
        @change="changeConfig()"
      />
    </div>
    <div class="manage-text dp-space-center">
      <span>{{ $t(`Set Top`) }} :</span>
      <el-switch
        active-color="#16ab78"
        v-model="isTop"
        @change="changeConfig()"
      />
    </div>
    <div class="manage-text dp-space-center">
      <span>{{ $t(`Block`) }} :</span>
      <el-switch
        active-color="#16ab78"
        v-model="isBlock"
        @change="changeConfig()"
      />
    </div>

    <div class="button dp-center-center">
      <tbutton
        @click="exitVisible = true"
        style="width: 120px"
        v-if="groupRole"
        >{{ groupRole === 4 ? "Unscribe" : "Exit" }}</tbutton
      >
      <tbutton
        v-else-if="groupRole === 0"
        @click="disbandVisible = true"
        style="width: 120px"
      >
        Disband
      </tbutton>
    </div>
  </div>

  <el-drawer
    v-model="adminVisible"
    direction="rtl"
    :size="350"
    custom-class="p0-drawer"
    title="Moderator"
  >
    <div class="add-member">
      <div
        class="container dp--center"
        v-for="(item, index) in adminArray"
        :key="'add-member' + index"
        @click="changeModerator(item)"
      >
        <el-avatar fit="cover" :size="40" :src="item.userAvatar" />
        <div class="name">{{ item.userName }}</div>
      </div>
    </div>
  </el-drawer>
  <el-drawer
    v-model="followVisible"
    direction="rtl"
    :size="350"
    custom-class="p0-drawer"
  >
    <div class="info">
      <div
        class="container dp-space-center manage-item"
        v-for="(item, index) in followList"
        :key="'manage' + index"
      >
        <div class="left dp--center">
          <el-avatar fit="cover" :size="40" :src="item.userAvatar" />
          <div class="name">{{ item.userName }}</div>
        </div>
        <div class="right dp--center">
          <!-- <div class="dp--center">
            <span style="margin-right: 10px">{{
              $t(`text['${roleArray[item.role]}']`)
            }}</span>
            <el-icon v-if="groupRole < 2 && item._key !== user?._key">
              <arrow-down />
            </el-icon>
          </div> -->

          <el-popover
            :width="50"
            ref="popoverRef"
            trigger="click"
            :disabled="!(groupRole < 2 && item._key !== user?._key)"
          >
            <template #reference>
              <div class="manage-role dp--center">
                <span style="margin-right: 10px">
                  {{ roleArray[item.role] }}
                </span>
                <el-icon v-if="groupRole < 2 && item._key !== user?._key">
                  <arrow-down />
                </el-icon>
              </div>
            </template>
            <div class="role-container">
              <div class="role-item" v-if="groupRole === 0">Owner</div>
              <div
                class="role-item"
                @click="changeRole(item, index, 1, 'follow')"
              >
                {{ $t(`Admin`) }}
              </div>
              <div
                class="role-item"
                @click="changeRole(item, index, 2, 'follow')"
              >
                {{ $t(`Edit`) }}
              </div>
              <div
                class="role-item"
                @click="changeRole(item, index, 3, 'follow')"
              >
                Writer
              </div>
              <el-divider />
              <div
                class="role-item"
                @click="
                  delItem = {
                    item: item,
                    index: index,
                    type: 'follow',
                  };
                  delVisible = true;
                "
              >
                {{ $t(`Delete`) }}
              </div>
            </div>
          </el-popover>
          <div style="width: 20px; height: 20px; margin-left: 10px">
            <el-tooltip
              :content="$t(`Mates`)"
              placement="top"
              v-if="
                groupKeyArray.indexOf(item._key) === -1 &&
                item._key !== user?._key
              "
            >
              <icon-font
                class="icon-point del-button"
                name="addmate"
                :size="20"
                @click="saveMember(item._key)"
              />
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
  <el-drawer
    v-model="memberVisible"
    direction="rtl"
    :size="350"
    custom-class="p0-drawer"
    :before-close="
      (done) => {
        saveGroup('member', done);
        teamKeyArray = [];
      }
    "
  >
    <div class="add-member">
      <div
        class="container dp-space-center"
        v-for="(item, index) in memberArray"
        :key="'add-member' + index"
        @click="chooseMember(item)"
      >
        <div class="left dp--center">
          <el-avatar fit="cover" :size="40" :src="item.avatar" />
          <div class="name">{{ item.title }}</div>
        </div>
        <div class="right">
          <img
            :src="
              teamKeyArray.indexOf(item.toUserKey as string) !== -1 ? chooseSvg : unchooseSvg
            "
            alt=""
            style="width: 20px; height: 20px; margin-right: 10px"
          />
        </div>
      </div>
    </div>
  </el-drawer>
  <el-drawer
    v-model="avatarVisible"
    direction="rtl"
    :size="350"
    :with-header="false"
  >
    <div class="avatar-container" @scroll="scrollAvatar">
      <div
        class="avatar-item"
        v-for="(thirdPngItem, thirdPngIndex) in avatarList"
        :key="'avatar' + thirdPngIndex"
      >
        <img
          :src="thirdPngItem.url"
          alt=""
          @click="
            avatarVisible = false;
            avatar = thirdPngItem.url;
          "
        />
      </div>
    </div>
  </el-drawer>
  <!-- <el-drawer
    v-model="filedVisible"
    direction="rtl"
    :size="350"
    :title="$t(`icon.Archive`)"
    custom-class="p0-drawer"
  >
    <div class="filed p-5" @scroll="scrollFiled">
      <template v-for="(item, index) in filedArray" :key="'filed' + index">
        <message-item :item="item" :type="'filed'" @changeItem="flashFiled" />
      </template>
    </div>
  </el-drawer> -->
  <el-drawer
    v-model="trashVisible"
    direction="rtl"
    :size="350"
    :title="$t(`Archive`)"
    custom-class="p0-drawer"
  >
    <div class="filed p-5" @scroll="scrollTrash">
      <div
        class="dp--center"
        style="justify-content: flex-end; margin-top: 10px"
      >
        <tbutton @click="clearVisible = true">Dump All</tbutton>
      </div>
      <template v-for="(item, index) in trashArray" :key="'trash' + index">
        <message-item :item="item" :type="'trash'" @changeItem="flashTrash" />
      </template>
    </div>
  </el-drawer>
  <el-dialog v-model="exitVisible" title="Tips" width="350px">
    <span>out Group</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="exitVisible = false" bgColor="#d1dbe5">{{
          $t(`Cancel`)
        }}</tbutton>
        <tbutton @click="exitGroup()">{{ $t(`OK`) }}</tbutton>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="delVisible"
    :title="$t(`Delete prompt`)"
    width="350px"
  >
    <span>{{ $t(`Delete team members`) }}</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="delVisible = false" bgColor="#d1dbe5">{{
          $t(`Cancel`)
        }}</tbutton>
        <tbutton
          @click="
            delItem
              ? delMember(delItem.item, delItem.index, delItem.type)
              : null
          "
          >{{ $t(`OK`) }}</tbutton
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="clearVisible"
    :title="$t(`Delete prompt`)"
    width="350px"
  >
    <span>Clear All</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="delVisible = false" :disabled="true">{{
          $t(`Cancel`)
        }}</tbutton>
        <tbutton @click="deleteTrash">{{ $t(`OK`) }}</tbutton>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="disbandVisible" title="Tips" width="350px">
    <span>Disband This Board</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="disbandVisible = false" bgColor="#d1dbe5">{{
          $t(`Cancel`)
        }}</tbutton>
        <tbutton @click="disbandGroup()">{{ $t(`OK`) }}</tbutton>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.manage {
  width: 100vw;
  height: calc(100vh - 55px);
  background: var(--talk-bg-color);
  overflow: auto;
  .title {
    width: 100%;
    height: 45px;
    font-size: 18px;
    font-weight: 400;
    line-height: 45px;
    margin: 15px 0px;
  }
  .footer {
    width: 100%;
    height: 40px;
  }
  .info {
    width: 100%;
    .manage-item {
      .del-button {
        width: 100%;
        height: 100%;
      }
    }
  }
  .button {
    width: 100%;
    height: 40px;
    margin-bottom: 20px;
  }
}
.add-member {
  padding: 15px 10px;
  box-sizing: border-box;
}
.manage-text {
  height: 50px;
}
.filed {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.avatar-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  .avatar-item {
    margin-right: 15px;
    margin-bottom: 15px;
    img {
      width: 60px;
      height: 60px;
    }
  }
}
.manage-role {
  color: var(--talk-font-color-2);
  font-size: 14px;
}
.role-container {
  .role-item {
    height: 35px;
    line-height: 35px;
    &:hover {
      background-color: var(--talk-hover-color);
    }
  }
}
.more-button {
  width: 100%;
  height: 30px;
  text-align: right;
  line-height: 30px;
}
</style>
<style></style>
