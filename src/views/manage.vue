<script setup lang="ts">
import { DArrowLeft } from "@element-plus/icons-vue";
import { useStore } from "@/store";

import chooseSvg from "../assets/svg/choose.svg";
import unchooseSvg from "../assets/svg/unchoose.svg";
import addPersonSvg from "../assets/svg/addPerson.svg";
import delSvg from "../assets/svg/del.svg";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { ElMessage } from "element-plus";
import { Group, Member } from "@/interface/User";
const router = useRouter();
const route = useRoute();
const store = useStore();

const groupList = computed(() => store.state.auth.groupList);
const user = computed(() => store.state.auth.user);
const memberList = computed(() => store.state.auth.memberList);
const groupTitle = computed(() => store.state.auth.groupTitle);
const groupRole = computed(() => store.state.auth.groupRole);

const teamName = ref<string>("");
const teamKey = ref<string>("");
const teamKeyArray = ref<string[]>([]);
const teamArray = ref<Group[]>([]);
const memberArray = ref<Group[]>([]);
const exitVisible = ref<boolean>(false);
const memberVisible = ref<boolean>(false);
const disbandVisible = ref<boolean>(false);

const memberKeyArray = ref<string[]>([]);
const groupKeyArray = ref<string[]>([]);
const groupHeight = ref<number>(0);
const delVisible = ref<boolean>(false);
const delItem = ref<{ item: Member; index: number } | null>(null);
const roleArray = ["组长", "管理员", "组员"];

onMounted(() => {
  teamKey.value =
    route.params.id !== "create" ? (route.params.id as string) : "";
  groupHeight.value = document.documentElement.offsetHeight - 105;
  if (teamKey.value) {
    store.dispatch("auth/getMemberList", teamKey.value);
  }
});
const chooseMember = (item: Group) => {
  console.log(item);
  let index = teamKeyArray.value.indexOf(item.toUserKey as string);
  if (index === -1) {
    teamKeyArray.value.push(item.toUserKey as string);
    teamArray.value.push(item);
  } else {
    teamKeyArray.value.splice(index, 1);
    teamArray.value.splice(index, 1);
  }
};
const delMember = async (item: Member, index: number) => {
  const delRes = (await api.request.delete("receiver/member", {
    receiverKey: teamKey.value,
    memberKey: item._key,
  })) as ResultProps;
  if (delRes.msg === "OK") {
    ElMessage.success("Delete GroupMember Success");
    store.commit("auth/delMemberList", index);
    delVisible.value = false;
    delItem.value = null;
  }
};
const saveGroup = async () => {
  if (!teamName.value) {
    ElMessage.error(`Please enter a word`);
    return;
  }
  let groupRes: null | ResultProps = null;
  const config = {
    title: teamName.value,
    memberKeyArr: teamKeyArray.value,
  };
  if (teamKey.value) {
    groupRes = (await api.request.patch("receiver", {
      receiverKey: teamKey.value,
      ...config,
    })) as ResultProps;
  } else {
    groupRes = (await api.request.post("receiver", {
      receiverType: "group",
      ...config,
    })) as ResultProps;
  }
  if (groupRes.msg === "OK") {
    ElMessage.success(`${teamKey.value ? "Update" : "Create"} Group Success`);
    router.push("/home");
    store.dispatch("auth/getGroupList");
  }
};
const changeRole = async (item: Member, index: number, role: number) => {
  let roleRes = (await api.request.patch("receiver/member/role", {
    receiverKey: teamKey.value,
    memberKey: item._key,
    role: role,
  })) as ResultProps;
  if (roleRes.msg === "OK") {
    ElMessage.success(`${teamKey.value ? "Update" : "Create"} Role Success`);
    store.commit("auth/updateMemberList", {
      ...memberList.value[index],
      role: role,
    });
  }
};
const saveMember = async (userKey: string) => {
  const saveRes = (await api.request.post("receiver", {
    receiverType: "user",
    toUserKey: userKey,
  })) as ResultProps;
  if (saveRes.msg === "OK") {
    ElMessage.success("add Member success");
    store.dispatch("auth/getGroupList");
  }
};
const exitGroup = async () => {
  const exitRes = (await api.request.delete("receiver/exit", {
    receiverKey: teamKey.value,
  })) as ResultProps;
  if (exitRes.msg === "OK") {
    ElMessage.success("exit Group success");
    store.dispatch("auth/getGroupList", "delete");
    router.push("/home");
  }
};
const disbandGroup = async () => {
  const disbandRes = (await api.request.delete("receiver", {
    receiverKey: teamKey.value,
  })) as ResultProps;
  if (disbandRes.msg === "OK") {
    ElMessage.success("disband Group success");
    store.dispatch("auth/getGroupList", "delete");
    router.push("/home");
  }
};
watchEffect(() => {
  memberArray.value = [];
  memberKeyArray.value = memberList.value.map((item: Member) => {
    return item._key;
  });
  groupList.value.forEach((item: Group) => {
    item.toUserKey ? groupKeyArray.value.push(item.toUserKey) : null;
    if (
      item.receiverType === "user" &&
      teamKeyArray.value.indexOf(item.toUserKey as string) === -1 &&
      memberKeyArray.value.indexOf(item.toUserKey as string) === -1
    ) {
      console.log(item);
      memberArray.value.push(item);
    }
  });
});
watch(
  () => groupTitle.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      teamName.value = groupTitle.value;
    }
  },
  {
    immediate: true,
  }
);
</script>
<template>
  <div class="manage p-5">
    <div class="header dp--center">
      <el-icon
        style="margin-right: 10px; cursor: pointer"
        size="20px"
        @click="router.push('/home')"
        ><d-arrow-left /></el-icon
      >{{ $t(`surface.Manage`) }}
    </div>
    <div class="title dp-space-center">
      <el-input
        v-model="teamName"
        placeholder="请输入小组名"
        style="width: calc(100% - 120px)"
      />
      <el-button
        type="primary"
        style="height: 40px; padding: 0px 30px"
        @click="saveGroup"
      >
        {{ teamKey ? $t(`surface.Update`) : $t(`surface.Save`) }}
      </el-button>
    </div>
    <div class="info">
      <div
        class="container dp-space-center manage-item"
        v-for="(item, index) in memberList"
        :key="'manage' + index"
      >
        <div class="left dp--center">
          <el-avatar :size="40" :src="item.userAvatar" />
          <div class="name">{{ item.userName }}</div>
        </div>
        <div class="right dp--center">
          <el-dropdown :disabled="groupRole !== 0 || item._key === user?._key">
            <el-button type="text"> {{ roleArray[item.role] }}</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="changeRole(item, index, 1)"
                  >管理员
                </el-dropdown-item>
                <el-dropdown-item @click="changeRole(item, index, 2)"
                  >组员
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div style="width: 20px; height: 20px; margin-left: 10px">
            <img
              :src="addPersonSvg"
              alt=""
              class="del-button"
              style="width: 100%; height: 100%"
              @click="saveMember(item._key)"
              v-if="
                groupKeyArray.indexOf(item._key) === -1 &&
                item._key !== user?._key
              "
            />
          </div>
          <div style="width: 20px; height: 20px; margin-left: 10px">
            <img
              :src="delSvg"
              alt=""
              class="del-button"
              style="width: 100%; height: 100%"
              @click="
                delItem = {
                  item: item,
                  index: index,
                };
                delVisible = true;
              "
              v-if="groupRole === 0 && item._key !== user?._key"
            />
          </div>
        </div>
      </div>
      <div
        class="container dp-space-center manage-item"
        v-for="(item, index) in teamArray"
        :key="'manage' + index"
      >
        <div class="left dp--center">
          <el-avatar :size="40" :src="item.avatar" />
          <div class="name">{{ item.title }}</div>
        </div>
        <div class="right">
          <img
            :src="delSvg"
            alt=""
            style="width: 20px; height: 20px"
            class="del-button"
            @click="chooseMember(item)"
          />
        </div>
      </div>
    </div>
    <div class="footer dp-space-center">
      <el-button
        type="primary"
        style="height: 40px; padding: 0px 30px"
        @click="exitVisible = true"
        v-if="groupRole"
        >{{ $t(`surface['Exit']`) }}</el-button
      >
      <el-button
        type="primary"
        style="height: 40px; padding: 0px 30px"
        @click="disbandVisible = true"
        v-if="!groupRole"
        >{{ $t(`surface.disband`) }}</el-button
      >
      <el-button
        type="primary"
        style="height: 40px; padding: 0px 30px"
        @click="memberVisible = true"
        >{{ $t(`surface['+ Member']`) }}</el-button
      >
    </div>
  </div>
  <el-drawer
    v-model="memberVisible"
    direction="btt"
    :title="$t(`surface['+ Member']`)"
    :size="groupHeight"
    custom-class="radius-drawer"
  >
    <div class="add-member">
      <div
        class="container dp-space-center"
        v-for="(item, index) in memberArray"
        :key="'add-member' + index"
        @click="chooseMember(item)"
      >
        <div class="left dp--center">
          <el-avatar :size="40" :src="item.avatar" />
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
  <el-dialog v-model="exitVisible" title="Tips" width="350px">
    <span>{{ $t(`form.out`) }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="exitVisible = false">Cancel</el-button>
        <el-button type="primary" @click="exitGroup()">Sure</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="disbandVisible" title="Tips" width="350px">
    <span>{{ $t(`form.disband`) }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="disbandVisible = false">Cancel</el-button>
        <el-button type="primary" @click="disbandGroup()">Sure</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="delVisible" title="Tips" width="350px">
    <span>{{ $t(`form.delete`) }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="delVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="delItem ? delMember(delItem.item, delItem.index) : null"
          >Sure</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.manage {
  width: 100vw;
  height: 100vh;
  background: var(--talk-bg-color);
  .header {
    width: 100%;
    height: 55px;
    text-align: center;
  }
  .title,
  .footer {
    width: 100%;
    height: 40px;
  }
  .info {
    height: calc(100% - 175px);
    margin: 10px 0px;
    overflow: auto;
    .manage-item {
      .del-button {
        width: 100%;
        height: 100%;
      }
      // .right {
      //   display: none;
      // }
      // &:hover .right {
      //   display: flex;
      // }
    }
  }
  .footer {
    // justify-content: flex-end;
  }
}
.add-member {
  padding: 0px 10px;
  box-sizing: border-box;
}
</style>
<style></style>
