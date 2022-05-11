import { createApp } from "vue";
import App from "./App.vue";
import { store, key } from "./store";
import router from "./router";
import SocketIO from "./plugins/io";
import i18n from "./language/i18n";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Theader from "@/components/theader.vue";
import Tbutton from "@/components/tbutton.vue";
import IconFont from "@/components/iconFont.vue";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "./styles/common/common.scss";
import "./styles/element/common.scss";
import "element-plus/dist/index.css";

const app = createApp(App);
dayjs.extend(relativeTime);

app.config.globalProperties.$dayjs = dayjs;
app.provide("dayjs", dayjs);

app
  .component("theader", Theader)
  .component("tbutton", Tbutton)
  .component("icon-font", IconFont);
app
  .use(store, key)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(SocketIO, {
    connection: "https://ttalkdata.qingtime.cn",
  })
  .use(i18n)

  .mount("#app");
