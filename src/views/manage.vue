<script setup lang="ts">
import { ArrowDown, Check, Close } from "@element-plus/icons-vue";
import { useStore } from "@/store";

import chooseSvg from "@/assets/svg/choose.svg";
import unchooseSvg from "@/assets/svg/unchoose.svg";
import addPersonSvg from "@/assets/svg/addPerson.svg";
import addMemberSvg from "@/assets/svg/addMember.svg";
import agreeSvg from "@/assets/svg/agree.svg";
import rejectSvg from "@/assets/svg/reject.svg";
import delSvg from "@/assets/svg/del.svg";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { ElMessage } from "element-plus";
import { Group, Member } from "@/interface/User";
import Tbutton from "@/components/tbutton.vue";
import i18n from "@/language/i18n";
import Theader from "@/components/theader.vue";

import setSvg from "@/assets/svg/Settings.svg";
import setwSvg from "@/assets/svg/Settingsw.svg";
const router = useRouter();
const route = useRoute();
const store = useStore();

const groupList = computed(() => store.state.auth.groupList);
const user = computed(() => store.state.auth.user);
const memberList = computed(() => store.state.auth.memberList);
const groupTitle = computed(() => store.state.auth.groupTitle);
const groupRole = computed(() => store.state.auth.groupRole);
const dark = computed(() => store.state.common.dark);

const teamName = ref<string>("");
const teamKey = ref<string>("");
const teamKeyArray = ref<string[]>([]);
const memberArray = ref<Group[]>([]);
const exitVisible = ref<boolean>(false);
const memberVisible = ref<boolean>(false);
const setVisible = ref<boolean>(false);
const memberKeyArray = ref<string[]>([]);
const groupKeyArray = ref<string[]>([]);
const delVisible = ref<boolean>(false);
const isPublic = ref<boolean>(false);
const allowJoin = ref<boolean>(false);
const isMute = ref<boolean>(false);
const isBlock = ref<boolean>(false);

const applyArray = ref<Member[]>([]);
const delItem = ref<{ item: Member; index: number } | null>(null);
const roleArray = ["owner", "admin", "editor", "member"];

onMounted(() => {
  teamKey.value = route.params.id as string;
  store.dispatch("auth/getMemberList", teamKey.value);
  getInfo();
  getApplyList();
});
const getInfo = async () => {
  let infoRes = (await api.request.get("receiver/info", {
    receiverKey: teamKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    teamName.value = infoRes.data.title;
    allowJoin.value = infoRes.data.allowJoin;
    isPublic.value = infoRes.data.isPublic;
    isMute.value = infoRes.data.mute;
    isBlock.value = infoRes.data.block;
  }
};
const getApplyList = async () => {
  let applyRes = (await api.request.get("receiver/apply/list", {
    receiverKey: teamKey.value,
  })) as ResultProps;
  if (applyRes.msg === "OK") {
    applyArray.value = applyRes.data;
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
const applyMember = async (key: string, state: boolean, index: number) => {
  const applyRes = (await api.request.patch("receiver/join/verify", {
    receiverKey: teamKey.value,
    memberKey: key,
    verifyResult: state,
  })) as ResultProps;
  if (applyRes.msg === "OK") {
    ElMessage.success("Apply GroupMember Success");
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
        ElMessage.error(i18n.global.t("message.teamName"));
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
      ElMessage.success(`Update Group Success`);
    } else if (type === "member") {
      store.commit("auth/addMemberList", groupRes.data);
    }
    if (done) {
      done();
    }
  }
};
const changeConfig = async () => {
  let infoRes = (await api.request.patch("receiver/status", {
    receiverKey: teamKey.value,
    mute: isMute.value,
    block: isBlock.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    ElMessage.success("Update Config Success");
    if (!isMute.value) {
      store.commit("auth/delMuteList", teamKey.value);
    }else{
      store.commit("auth/addMuteList", teamKey.value);
    }
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
    <template v-if="applyArray.length > 0 && groupRole < 2">
      <div class="title dp-space-center">
        {{ $t(`message.join`) }}
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
            <img
              :src="agreeSvg"
              class="icon-point"
              alt=""
              style="margin-right: 10px; width: 25px; height: 25px"
              @click="applyMember(item._key, true, index)"
            />
            <img
              :src="rejectSvg"
              class="icon-point"
              style="width: 25px; height: 25px"
              alt=""
              @click="applyMember(item._key, false, index)"
            />
          </div>
        </div>
      </div>
    </template>
    <div class="title dp-space-center">
      {{ $t(`message.selectTeam`) }} {{ ` ( ${memberList.length} ) ` }}
      <div class="dp--center icon-point" style="cursor: pointer">
        <img
          :src="addMemberSvg"
          alt=""
          style="margin-right: 15px; width: 30px; height: 30px"
          @click="memberVisible = true"
        />
        <img
          style="width: 25px; height: 25px"
          :src="dark ? setwSvg : setSvg"
          alt=""
          @click="setVisible = true"
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
          <el-avatar fit="cover" :size="40" :src="item.userAvatar" />
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
  </div>
  <el-drawer
    v-model="memberVisible"
    direction="rtl"
    :title="$t(`surface['+ Member']`)"
    :size="'80%'"
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
    v-model="setVisible"
    direction="rtl"
    :title="$t(`surface.Settings`)"
    :size="'80%'"
    custom-class="p0-drawer"
  >
    <template v-if="groupRole < 2">
      <div class="manage-text dp-space-center p-5" style="margin-top: 20px">
        <span>{{ $t(`form.public`) }} :</span>
        <el-switch
          active-color="#16ab78"
          v-model="isPublic"
          @change="saveGroup('public')"
        />
      </div>
      <div class="manage-text dp-space-center p-5">
        <span>{{ $t(`form.open`) }} :</span>
        <el-switch
          active-color="#16ab78"
          v-model="allowJoin"
          @change="saveGroup('join')"
        />
      </div>
      <el-divider />
    </template>

    <div class="manage-text dp-space-center p-5">
      <span>{{ $t(`form.mute`) }} :</span>
      <el-switch
        active-color="#16ab78"
        v-model="isMute"
        @change="changeConfig()"
      />
    </div>
    <div class="manage-text dp-space-center p-5">
      <span>{{ $t(`form.block`) }} :</span>
      <el-switch
        active-color="#16ab78"
        v-model="isBlock"
        @change="changeConfig()"
      />
    </div>

    <div class="manage-text dp-space-center p-5" v-if="groupRole">
      <span @click="exitVisible = true" class="exit icon-point">{{
        $t(`surface['Exit']`)
      }}</span>
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
}
.add-member {
  padding: 15px 10px;
  box-sizing: border-box;
}
.manage-text {
  height: 50px;
}
</style>
<style></style>
