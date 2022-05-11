import { MutationTree, ActionTree } from "vuex";
import { RootState } from "../types/RootState";
import { MessageState } from "../types/MessageState";
import { Message } from "@/interface/Message";
import { Group } from "@/interface/User";
import api from "@/services/api";
import auth from "./auth";
import { ResultProps } from "@/interface/Common";
import { Editor } from "@tiptap/vue-3";
import dayjs from "dayjs";

const state: MessageState = {
  receiver: null,
  talkKey: "",
  receiverType: localStorage.getItem("receiverType") || "",
  receiverNumber: 0,
  pageNumber: 1,
  page: 1,
  messageList: [],
  messageTitle: "",
  unReadNum: 0,
  editContent: null,
  editorInfo: null,
  editKey: "",
};

const mutations: MutationTree<MessageState> = {
  setReceiver(state, receiver: Group) {
    state.receiver = receiver;
  },
  setTalkKey(state, talkKey: string) {
    state.talkKey = talkKey;
  },
  setReceiverType(state, receiverType: string) {
    state.receiverType = receiverType;
    localStorage.setItem("receiverType", receiverType);
  },
  setMessageList(state, messageList: Message[]) {
    if (state.page === 1) {
      state.messageList = [];
    }
    state.messageList = [...state.messageList, ...messageList];
  },
  replaceMessageList(state, messageList: Message[]) {
    state.messageList = [...messageList];
  },
  addMessageList(state, messageItem: Message) {
    console.log(messageItem.creatorInfo._key, state.receiver?.toUserKey);
    if (
      (state.receiver?.receiverType === "user" &&
        (messageItem.creatorInfo._key === state.receiver?.toUserKey ||
          messageItem.creatorInfo._key === auth.state.user?._key)) ||
      (state.receiver?.receiverType === "group" &&
        messageItem.receiverKey === state.receiver?._key) ||
      state.receiverType === "unRead"
    ) {
      messageItem.hasRead = 0;
      state.messageList.unshift(messageItem);
    }
  },
  updateMessageList(state, messageItem: any) {
    if (
      (state.receiver?.receiverType === "user" &&
        (messageItem.creatorInfo._key === state.receiver?.toUserKey ||
          messageItem.creatorInfo._key === auth.state.user?._key)) ||
      (state.receiver?.receiverType === "group" &&
        messageItem.receiverKey === state.receiver?._key)
    ) {
      let targetIndex: number = 10000;
      let targetItem: Message | null = null;
      state.messageList = state.messageList.map(
        (item: Message, index: number) => {
          if (item._key === messageItem._key) {
            if (messageItem.unRead) {
              if (!item.unRead) {
                item.unRead = 0;
              }
              item.unRead = item.unRead + messageItem.unRead;
            } else if (messageItem.unRead === 0) {
              item.commentCount =
                (item.commentCount as number) + (item.unRead as number);
              item.unRead = 0;
            }
            item = { ...item, ...messageItem };
            console.log(index);
            targetIndex = index;
            targetItem = { ...item };
          }
          return item;
        }
      );
      if (targetIndex === 10000) {
        console.log(messageItem);
        state.messageList.unshift(messageItem);
      } else if (targetItem) {
        // console.log(targetIndex);
        //@ts-ignore
        state.messageList[targetIndex] = targetItem;
        // state.messageList.unshift(targetItem);
      }
    }
  },
  delMessageList(state, messageKey: string) {
    state.messageList = state.messageList.filter((item: Message) => {
      return item._key !== messageKey;
    });
  },
  setReceiverNumber(state, receiverNumber: number) {
    state.receiverNumber = receiverNumber;
  },
  setPage(state, page: number) {
    state.page = page;
  },
  setPageNumber(state, pageNumber: number) {
    state.pageNumber = pageNumber;
  },
  setEditContent(state, editContent: any) {
    state.editContent = editContent;
  },
  updateEditContent(state, editItem: any) {
    state.editContent = { ...state.editContent, ...editItem };
  },
  setEditKey(state, editKey: string) {
    state.editKey = editKey;
  },
  setEditor(state, editorInfo: Editor) {
    state.editorInfo = editorInfo;
  },
  setUnreadNum(state, unReadNum: number) {
    state.unReadNum = unReadNum;
  },
};

const actions: ActionTree<MessageState, RootState> = {
  async getMessageList({ commit }, page: number) {
    let obj: any = {
      page: page,
      limit: 30,
    };
    if (state.receiver) {
      if (state.receiver.receiverType === "group") {
        obj.receiverKey = state.receiver._key;
      } else {
        obj.filterUser = state.receiver.toUserKey;
      }
      if (state.messageTitle) {
        obj.title = state.messageTitle;
      }
    } else if (
      state.receiverType === "read" ||
      state.receiverType === "unRead"
    ) {
      obj.type = "receive";
      obj.hasRead = state.receiverType === "read" ? 1 : 0;
    } else {
      obj.type = state.receiverType;
    }
    // if (state.messageList.length > 0) {
    //   obj.latestKey = state.messageList[state.messageList.length - 1]._key;
    // }
    const messageRes = (await api.request.get("message/list", {
      ...obj,
    })) as ResultProps;
    if (messageRes.msg === "OK") {
      commit("setPage", page);
      commit("setPageNumber", messageRes.pageNum as number);
      messageRes.data = messageRes.data.map((item) => {
        item.createTime = dayjs(item.createTime).toNow();
        return item;
      });
      commit("setMessageList", [...messageRes.data]);
      if (state.receiverType === "unRead") {
        commit("setUnreadNum", messageRes.total);
      }
    }
  },
  // changeLocale({ commit }, locale) {
  //   localStorage.setItem("LOCALE", locale);
  //   document.querySelector("html")?.setAttribute("lang", locale);
  //   commit("setLocale", locale);
  // },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
