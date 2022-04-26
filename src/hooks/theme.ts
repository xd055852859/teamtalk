import { ref } from "vue";
// import { store } from "../store";
import { useCssVar } from "@vueuse/core";
import { store } from "@/store";

const setTheme = (value: string) => {
  // console.log("执行切换主题色事件：", value);
  const el = ref(null);
  // document.documentElement.style.setProperty(`--el-color-primary`, value);
  const primary_color = useCssVar("--el-color-success", el);
  primary_color.value = value;
};

export default setTheme;
