import { MutationTree, ActionTree } from "vuex";
import { RootState } from "../types/RootState";
import { CommonState } from "../types/CommonState";

const state: CommonState = {
  locale: localStorage.getItem("LANGUAGE")
    ? (localStorage.getItem("LANGUAGE") as "zh" | "en")
    : "zh",
  dark: localStorage.getItem("DARK") ? true : false,
  theme: localStorage.getItem("THEME") || "#87b940",
  loading: false,
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