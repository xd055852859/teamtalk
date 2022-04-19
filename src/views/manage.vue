<script setup lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";
import { useStore } from "@/store";

import chooseSvg from "@/assets/svg/choose.svg";
import unchooseSvg from "@/assets/svg/unchoose.svg";
import addPersonSvg from "@/assets/svg/addPerson.svg";
import addMemberSvg from "@/assets/svg/addMember.svg";
import delSvg from "@/assets/svg/del.svg";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { ElMessage } from "element-plus";
import { Group, Member } from "@/interface/User";
import Tbutton from "@/components/tbutton.vue";
import i18n from "@/language/i18n";
import Theader from "@/components/theader.vue";
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
const memberArray = ref<Group[]>([]);
const exitVisible = ref<boolean>(false);
const memberVisible = ref<boolean>(false);

const memberKeyArray = ref<string[]>([]);
const groupKeyArray = ref<string[]>([]);
const delVisible = ref<boolean>(false);
const delItem = ref<{ item: Member; index: number } | null>(null);
const roleArray = ["owner", "admin", "editor", "member"];

onMounted(() => {
  teamKey.value = route.params.id as string;
  store.dispatch("auth/getMemberList", teamKey.value);
});
const chooseMember = (item: Group) => {
  let index = teamKeyArray.value.indexOf(item.toUserKey as string);
  if (index === -1) {
    teamKeyArray.value.push(item.toUserKey as string);
  } else {
    teamKeyArray.value.splice(index, 1);
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
const saveGroup = async (type, done?: any) => {
  if (!teamName.value) {
    ElMessage.error(i18n.global.t("message.teamName"));
    return;
  }
  const config = {
    title: teamName.value,
    memberKeyArr: type === "name" ? [] : teamKeyArray.value,
  };
  if (type === "member" && teamKey.value.length === 0) {
    return;
  }
  const groupRes = (await api.request.patch("receiver", {
    receiverKey: teamKey.value,
    ...config,
  })) as ResultProps;
  if (groupRes.msg === "OK") {
    if (type === "name") {
      ElMessage.success(`Update Group Success`);
    }
    // router.push("/home");
    // store.dispatch("auth/getGroupList");
    store.commit("auth/addMemberList", groupRes.data);
    done();
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
watchEffect(() => {
  memberArray.value = [];
  memberKeyArray.value = memberList.value.map((item: Member) => {
    return item._key;
  });
  groupList.value.forEach((item: Group) => {
    item.toUserKey ? groupKeyArray.value.push(item.toUserKey) : null;
    if (
      item.receiverType === "user" &&
      memberKeyArray.value.indexOf(item.toUserKey as string) === -1
    ) {
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
    <theader
      @clickBack="
        $router.back();
        store.dispatch('auth/getGroupList');
      "
    >
      <template v-slot:title>
        <el-input
          v-model="teamName"
          placeholder="请输入小组名"
          v-if="groupRole == 0"
        />
        <span v-else>{{ teamName }}</span>
      </template>
      <template v-slot:right>
        <tbutton
          style="height: 40px; padding: 0px 30px"
          @click="saveGroup('name')"
        >
          {{ $t(`surface.Update`) }}
        </tbutton>
      </template>
    </theader>
    <div class="title dp-space-center">
      {{ $t(`message.selectTeam`) }}
      <div
        class="dp--center"
        @click="memberVisible = true"
        style="cursor: pointer"
      >
        Add
        <img
          :src="addMemberSvg"
          alt=""
          style="margin-left: 15px; width: 35px; height: 35px"
        />
      </div>
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
          <el-dropdown :disabled="groupRole > 1 || item._key === user?._key">
            <div class="dp--center">
              <span style="margin-right: 10px">{{ roleArray[item.role] }}</span
              ><el-icon v-if="groupRole < 2 && item._key !== user?._key"
                ><arrow-down
              /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="groupRole === 0"
                  >owner
                </el-dropdown-item>
                <el-dropdown-item @click="changeRole(item, index, 1)"
                  >admin
                </el-dropdown-item>
                <el-dropdown-item @click="changeRole(item, index, 3)"
                  >editor
                </el-dropdown-item>
                <el-dropdown-item @click="changeRole(item, index, 4)"
                  >member
                </el-dropdown-item>
                <el-divider />
                <el-dropdown-item
                  @click="
                    delItem = {
                      item: item,
                      index: index,
                    };
                    delVisible = true;
                  "
                  >delete
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div style="width: 20px; height: 20px; margin-left: 10px">
            <el-tooltip content="+ mate" placement="top">
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
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="footer dp-space-center">
      <span @click="exitVisible = true" v-if="groupRole" class="exit">{{
        $t(`surface['Exit']`)
      }}</span>
      <div>Block <el-switch /></div>
      <div>Message Sound <el-switch /></div>
    </div>
  </div>
  <el-drawer
    v-model="memberVisible"
    direction="rtl"
    :title="$t(`surface['+ Member']`)"
    :size="300"
    custom-class="p0-drawer"
    :before-close="
      (done) => {
        saveGroup('member', done);
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
      <span class="dialog-footer dp-space-center">
        <tbutton @click="exitVisible = false" :disabled="true">Cancel</tbutton>
        <tbutton @click="exitGroup()">Sure</tbutton>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="delVisible" title="Tips" width="350px">
    <span>{{ $t(`form.delete`) }}</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <tbutton @click="delVisible = false" :disabled="true">Cancel</tbutton>
        <tbutton
          @click="delItem ? delMember(delItem.item, delItem.index) : null"
          >Sure</tbutton
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
    height: calc(100% - 180px);
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
    width: 100%;
    // justify-content: flex-end;
    .exit {
      cursor: pointer;
    }
  }
}
.add-member {
  padding: 15px 10px;
  box-sizing: border-box;
}
</style>
<style></style>
