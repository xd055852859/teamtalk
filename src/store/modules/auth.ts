import { MutationTree, ActionTree } from "vuex";
import { RootState } from "../types/RootState";
import { AuthState } from "../types/AuthState";
import common from "./common";
import message from "./message";
import { User, Group, Member } from "@/interface/User";
import i18n from "@/language/i18n";
import router from "@/router";
import { ElMessage } from "element-plus";

import groupSvg from "@/assets/svg/group.svg";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";

const state: AuthState = {
  token: localStorage.getItem("token") || "",
  user: null,
  groupList: [],
  muteList: [],
  groupItem: null,
  //0:组长 1:管理员 2:编辑 3:组员
  groupRole: 4,
  memberList: [],
  followList:[],
  uploadToken: null,
  groupTitle: "",

};

const mutations: MutationTree<AuthState> = {
  setToken(state, token: string) {
    state.token = token;
  },

  setUploadToken(state, uploadToken: string) {
    state.uploadToken = uploadToken;
  },

  setUserInfo(state, user: User) {
    state.user = user;
  },
  setGroupList(state, groupList: Group[]) {
    state.groupList = groupList;
  },
  updateGroupList(state, groupItem: Group) {
    state.groupList = state.groupList.map((item) => {
      if (item._key === groupItem._key) {
        item = { ...item, ...groupItem };
      }
      return item;
    });
  },
  setGroupItem(state, groupItem: Group) {
    state.groupItem = groupItem;
  },
  setGroupTitle(state, groupTitle: string) {
    state.groupTitle = groupTitle;
  },
  setGroupRole(state, groupRole: number) {
    state.groupRole = groupRole;
  },
  setMemberList(state, memberList: Member[]) {
    state.memberList = memberList;
  },
  delMemberList(state, index: number) {
    state.memberList.splice(index, 1);
  },
  updateMemberList(state, memberItem: Member) {
    state.memberList = state.memberList.map((item) => {
      if (item._key === memberItem._key) {
        item = { ...item, ...memberItem };
      }
      return item;
    });
  },
  addMemberList(state, memberList: Member[]) {
    state.memberList = [...state.memberList, ...memberList];
  },

  addGroupList(state, groupItem: Group) {
    state.groupList.push(groupItem);
  },
  setMuteList(state, muteList: string[]) {
    state.muteList = [...muteList];
  },
  delMuteList(state, key: string) {
    let index = state.muteList.indexOf(key);
    if (index !== -1) {
      state.muteList.splice(index, 1);
    }
  },
  addMuteList(state, key: string) {
    let index = state.muteList.indexOf(key);
    if (index === -1) {
      state.muteList.push(key);
    }
  },
  setLogout() {
    localStorage.removeItem("token");
    router.push("/");
    ElMessage({
      message: i18n.global.t(`tip['LogOut successfully']`),
      type: "success",
      duration: 1000,
    });
  },
};

const actions: ActionTree<AuthState, RootState> = {
  async getUptoken({ commit }) {
    const tokenRes: any = (await api.request.get(
      "upTokenQiniu/getQiNiuUpToken",
      {
        token: state.token,
        type: 2,
        bucketType: 6,
      },
      true
    )) as ResultProps;
    if (tokenRes.msg === "OK") {
      commit("setUploadToken", tokenRes.result);
    }
  },
  async getGroupList({ commit }, type?: string) {
    const memberRes: any = (await api.request.get(
      "receiver/list"
    )) as ResultProps;
    if (memberRes.msg === "OK") {
      let muteArray: string[] = [];
      memberRes.data = memberRes.data.map((item) => {
        if (item.receiverType === "group") {
          item.avatar = item.avatar ? item.avatar : groupSvg;
        }
        if (item.mute) {
          muteArray.push(
            item.receiverType === "user" ? item.toUserKey : item._key
          );
        }
        if (item.toUserKey === state.user?._key) {
          commit("setGroupItem", item);
        }
        return item;
      });
      commit("setMuteList", muteArray);
      commit("setGroupList", memberRes.data);

      // setTalker
      if (!message.state.talker || type === "delete") {
        commit("message/setTalker", memberRes.data[0], { root: true });
      }
    }
  },
  async getMemberList({ commit }, key: string) {
    const memberRes = (await api.request.get("receiver/member/list", {
      receiverKey: key,
    })) as ResultProps;
    if (memberRes.msg === "OK") {
      commit("setGroupTitle", memberRes.data.title);
      let arr = [...memberRes.data.memberList];
      commit("setGroupRole", memberRes.data.role);
      commit("setMemberList", arr);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
