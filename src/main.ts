import { createApp } from "vue";
import App from "./App.vue";
import { store, key } from "./store";
import router from "./router";
import i18n from "./language/i18n";
import SocketIO from "./plugins/io";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "./styles/common/common.scss";
import "./styles/element/common.scss";
import 'element-plus/dist/index.css'

const app = createApp(App);
app
  .use(store, key)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(i18n)
  .use(SocketIO, {
    connection: "https://ttalkdata.qingtime.cn",
  })

  .mount("#app");
