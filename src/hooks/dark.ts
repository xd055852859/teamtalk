import { color } from "./color";
import { useCssVar } from "@vueuse/core";
import { store } from "@/store";
// 切换暗黑模式
const setDark = (value: boolean) => {
  let { darkList, lightList } = color();
  console.log(store);
  // store.commit("setConfig", { themeType: value });
  if (value) {
    localStorage.setItem("DARK", value + "");
  } else {
    localStorage.removeItem("DARK");
  }
  console.log("执行切换开启暗黑模式事件：", value);
  const el = ref(null);
  if (value) {
    console.log("要切换为暗黑模式");
    darkList.value.forEach((item, index) => {
      const color_item = useCssVar(item.name, el);
      color_item.value = item.value;
    });
  } else {
    console.log("要切换为明亮模式");
    lightList.value.forEach((item, index) => {
      const color_item = useCssVar(item.name, el);
      color_item.value = item.value;
    });
  }
};

export default setDark;
