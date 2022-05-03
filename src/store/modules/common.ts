import { MutationTree, ActionTree } from "vuex";
import { RootState } from "../types/RootState";
import { CommonState } from "../types/CommonState";

const state: CommonState = {
  locale: localStorage.getItem("LANGUAGE")
    ? (localStorage.getItem("LANGUAGE") as string)
    : "zh",
  dark: localStorage.getItem("DARK") ? true : false,
  theme: "#16ab78",
  // localStorage.getItem("THEME") ||
  loading: false,
  top: 0,
  updateState: false,
};

const mutations: MutationTree<CommonState> = {
  setLocale(state, data) {
    state.locale = data;
  },
  setDark(state, data) {
    state.dark = data;
  },
  setTheme(state, data) {
    state.theme = data;
  },
  setLoading(state, data) {
    state.loading = data;
  },
  setTop(state, top: number) {
    state.top = top;
  },
  setUpdateState(state, updateState: boolean) {
    state.updateState = updateState;
  },
};

const actions: ActionTree<CommonState, RootState> = {
  // async getIconList({ commit }) {
  //   const res: any = await api.auth.getIcons(1, 1000);
  //   if (res.status === 200) {
  //     commit("setIconList", res.data);
  //   } else {
  //     const $toast = useToast();
  //     $toast({ message: res.msg, position: "top" });
  //   }
  // },
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
