// 颜色管理
export const lightColors = [
  { name: "--el-background-color-base", value: "#f5f8f5" },
  // { name: "--el-color-white", value: "#ffffff" },
  { name: " --el-collapse-header-bg-color", value: "#f5f8f5" },
 
  { name: "--el-text-color-primary", value: "#333" },
  { name: "--el-text-color-regular", value: "#606266" },
  { name: "--el-color-primary-light-9", value: "#ecf5ff" },
  { name: "--el-border-color-base", value: "#dcdfe6" },
  { name: "--el-border-color-light", value: "#e4e7ed" },
  { name: "--el-border-color-extra-light", value: "#f2f6fc" },
  { name: "--el-border-color-lighter", value: "#ebeef5" },
  { name: "--talk-font-color", value: "#333" },
  { name: "--talk-bg-color", value: "#f6f6f6" },
  { name: "--talk-hover-color", value: "#f0f0f0" },
  // { name: "--notes-color-border", value: "#e1e1e1" },
];

export const darkColors = [
  { name: "--el-background-color-base", value: "#373A48" },
  // { name: "--el-color-white", value: "#141414" },
  { name: " --el-collapse-header-bg-color", value: "#373A48" },
  { name: "--el-text-color-primary", value: "#333" },
  { name: "--el-text-color-regular", value: "#d0d0d0" },
  { name: "--el-color-primary-light-9", value: "#1f1f1f" },
  { name: "--el-border-color-base", value: "#434343" },
  { name: "--el-border-color-light", value: "#434343" },
  { name: "--el-border-color-extra-light", value: "#5c5c5c" },
  { name: "--el-border-color-lighter", value: "#434343" },
  { name: "--talk-font-color", value: "#fff" },
  { name: "--talk-bg-color", value: "#373A48" },
  { name: "--talk-bg-color", value: "#373A48" },
  { name: "--talk-hover-color", value: "#373A48" },
  // { name: "--notes-color-border", value: "#171923" },
];

export const color = () => {
  // 主题颜色变量组
  const themeList = ref([
    { name: "极光绿(默认)", value: "#03c160" },
    { name: "拂晓蓝", value: "#409eff" },
    { name: "薄暮红", value: "#e74c3c" },
    { name: "火山橘", value: "#e67e22" },
    { name: "日暮黄", value: "#f1c40f" },
    { name: "酱紫", value: "#9b59b6" },
    
  ]);
  // 明亮模式全局颜色
  const lightList = ref(lightColors);
  // 暗黑模式全局颜色
  const darkList = ref(darkColors);
  return {
    lightList,
    darkList,
    themeList,
  };
};
