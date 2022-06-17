<script setup lang="ts">
import { useStore } from "@/store";

import logoSvg from "../assets/svg/logo.svg";
// import logowSvg from "../assets/svg/logow.svg";
// import logoPng from "../assets/img/logo.png";
import brid1Svg from "../assets/svg/brid1.svg";
import brid2Png from "../assets/img/brid2.png";
import brid3Svg from "../assets/svg/brid3.svg";
import brid4Svg from "../assets/svg/brid4.svg";
import brid5Svg from "../assets/svg/brid5.svg";
import brid6Svg from "../assets/svg/brid6.svg";
import bottomSvg from "../assets/svg/welcome-bottom.svg";
import beanfont1Png from "../assets/img/beanfont1.png";
import beanfont2Png from "../assets/img/beanfont2.png";
import beanfont3Png from "../assets/img/beanfont3.png";
import beanfont4Png from "../assets/img/beanfont4.png";

import fastSvg from "../assets/svg/fast.svg";
import crossSvg from "../assets/svg/cross.svg";
import button1Svg from "../assets/svg/button1.svg";
import button2Svg from "../assets/svg/button2.svg";
import button3Svg from "../assets/svg/button3.svg";
import button4Svg from "../assets/svg/button4.svg";
const store = useStore();
const router = useRouter();
const dark = computed(() => store.state.common.dark);
const deviceType = computed(() => store.state.common.deviceType);
// import store from "@/store";
onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push("/home");
  }
});

const login = () => {
  let redirect = encodeURIComponent(
    `${window.location.protocol}//${window.location.host}/#/home/`
  );
  console.log(redirect);
  // `https://account.qingtime.cn?apphigh=50&redirect=&logo=https://workfly.qingtime.cn/1650849409262_workingVip.png`;
  let href: string = `https://account.qingtime.cn/?apphigh=50&logo=https://cdn-ttalk.qingtime.cn/1654336786857_workingVip.svg&redirect=${redirect}`;
  if (deviceType.value === "phone") {
    window.open(href);
  } else {
    window.open(href, "_self");
  }
};
</script>
<template>
  <div class="welcome-container">
    <div class="welcome">
      <div class="logo-img dp-center-center">
        <img :src="logoSvg" alt="" class="logo" />
        <div class="logo-title dp-center-center">信鸽</div>
        <div class="logo-subtitle dp-center-center">采集智慧,孵化灵感。</div>
      </div>
      <div class="button-box dp-center-center">
        <tbutton @click="login" class="button" round bgColor="#1a1a1a">
          {{ $t(`Login`) }}
        </tbutton>
      </div>
    </div>
    <img :src="brid1Svg" alt="" class="brid-img" />
    <div class="bean-container">
      <div class="bean-box">
        <img
          :src="beanfont1Png"
          alt=""
          class="bean-font-img"
          :style="{ height: deviceType === 'computer' ? '40vh' : '15vh' }"
        />
        <div class="bean-box-title">
          <div class="bean-font-title">覆盖多种场景</div>
          <div class="bean-font-subtitle">项目快报</div>
          <div class="bean-font-subtitle">会议纪要</div>
          <div class="bean-font-subtitle">知识分享</div>
          <div class="bean-font-subtitle">团队博客</div>
          <div class="bean-font-subtitle">......</div>
        </div>
      </div>
    </div>

    <div class="bean-img p-5" style="justify-content: flex-start">
      <img :src="brid2Png" alt="" />
    </div>
    <div class="bean-img" style="justify-content: flex-end;margin-bottom:25vh">
      <img :src="brid3Svg" alt="" />
    </div>
    <div class="bean-container">
      <div class="bean-box" style="justify-content: flex-end">
        <div
          class="bean-box-title"
          style="margin-right: 40px; flex-direction: row-reverse"
        >
          <div class="bean-font-title" style="text-align: right">
            团队敏捷协作
          </div>
          <div class="bean-font-subtitle" style="text-align: right">
            一键分发，全员感知
          </div>
          <div class="bean-font-subtitle" style="text-align: right">
            变更版本，全员知会
          </div>
          <div class="bean-font-subtitle" style="text-align: right">
            问题回复，立即触达
          </div>
          <div class="bean-font-subtitle" style="text-align: right">
            块编辑器，不断丰富
          </div>
          <div class="bean-font-subtitle" style="text-align: right">......</div>
        </div>
        <img
          :src="beanfont2Png"
          alt=""
          class="bean-font-img"
          :style="{ height: deviceType === 'computer' ? '40vh' : '15vh' }"
        />
      </div>
    </div>
    <div class="bean-img p-5" style="justify-content: flex-end;margin-bottom:25vh">
      <img :src="brid4Svg" alt="" />
    </div>
    <!-- <div class="bean-img"><img :src="bean3Png" alt="" /></div> -->
    <div class="bean-container">
      <div class="bean-box">
        <img
          :src="beanfont3Png"
          alt=""
          class="bean-font-img"
          :style="{ height: deviceType === 'computer' ? '40vh' : '15vh' }"
        />
        <div class="bean-box-title">
          <div class="bean-font-title">团队协作利器</div>
          <div class="bean-font-subtitle">多成员角色</div>
          <div class="bean-font-subtitle">强安全等级</div>
          <div class="bean-font-subtitle">消息已读随时看</div>
          <div class="bean-font-subtitle">全平台终端覆盖</div>
          <div class="bean-font-subtitle">......</div>
        </div>
      </div>
    </div>
     <div class="bean-img p-5" style="justify-content: flex-start">
      <img :src="brid5Svg" alt="" />
    </div>
    <div class="bean-img" style="justify-content: flex-end;margin-bottom:25vh">
      <img :src="brid6Svg" alt="" />
    </div>
    <!-- <div class="bean-img" style="justify-content: flex-start">
      <img :src="bean4Png" alt="" />
    </div> -->
    <div class="bean-container">
      <div class="bean-box" style="justify-content: flex-end">
        <div
          class="bean-box-title"
          style="margin-right: 40px; flex-direction: row-reverse"
        >
          <div class="bean-font-title" style="text-align: right">
            极致简约经济
          </div>
          <div class="bean-font-subtitle" style="text-align: right">
            省时间：无延迟无等待
          </div>
          <div class="bean-font-subtitle" style="text-align: right">
            省空间：PC端窄屏支持
          </div>
          <div class="bean-font-subtitle" style="text-align: right">
            省脑筋：原位置展开，自动保存
          </div>
          <div class="bean-font-subtitle" style="text-align: right">
            省费用：按效果付费无负担
          </div>
          <div class="bean-font-subtitle" style="text-align: right">......</div>
        </div>
        <img
          :src="beanfont4Png"
          alt=""
          class="bean-font-img"
          :style="{ height: deviceType === 'computer' ? '40vh' : '15vh' }"
        />
      </div>
    </div>
    <div class="bean-footer" :style="{'background-image':`url(${bottomSvg})`}">
      <div class="bean-footer-box dp-space-center p-5">
        <div
          class="bean-footer-item dp-center-center"
          :style="{ width: deviceType === 'computer' ? '40vw' : '100vw' }"
        >
          <img :src="fastSvg" alt="" />
          <div class="bean-footer-item-title dp-center-center">Fast</div>
          <div class="bean-footer-item-subtitle dp-center-center">
            Hate waiting on loading every single note you have? Say goodbye to the
            spinning icon.
          </div>
        </div>
        <div
          class="bean-footer-item dp-center-center"
          :style="{ width: deviceType === 'computer' ? '40vw' : '100vw' }"
        >
          <img :src="crossSvg" alt="" />
          <div class="bean-footer-item-title dp-center-center">Cross-device</div>
          <div class="bean-footer-item-subtitle dp-center-center">
            Sync and access your notes across unlimited desktop devices.
          </div>
        </div>
      </div>
      <div class="bean-footer-img dp-center-center">
        <img :src="button1Svg" alt=""/>
        <img :src="button2Svg" alt=""/>
        <img :src="button3Svg" alt=""/>
        <img :src="button4Svg" alt=""/>
      </div>
      <div class="button-box dp-center-center" style="margin-bottom: 30px">
          <tbutton @click="login" class="button" round bgColor="#1a1a1a">
            {{ $t(`button.Login`) }}
          </tbutton>
        <div class="button-title">Copyright &#169 2021 xiaoxiang.app. </div>
        <div class="button-title" style="margin-top:10px">苏ICP备15006448号</div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.welcome-container {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  .welcome {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    .logo-img {
      width: 100%;
      margin-bottom: 20vh;
      flex-wrap: wrap;
      .logo {
        width: 240px;
        height: 176px;
      }
      .logo-title {
        width: 100%;
        height: 50px;
        font-size: 44px;
        font-weight: 400;
        margin-top: 30px;
        margin-bottom: 20px;
      }
      .logo-subtitle {
        width: 100%;
        height: 40px;
        font-size: 24px;
        color: #939393;
      }
    }
  }
  .brid-img {
    width: 100vw;
    margin-bottom:25vh;
  }
  .bean-img {
    display: flex;
    justify-content: flex-end;
    margin: 5vh 0px 10vh 0px;
    img {
      max-width: 425px;
      width: 60vw;
      flex-shrink: 0;
    }
  }
  .bean-container {
    padding: 0px 5%;
    margin-bottom: 10vh;
    box-sizing: border-box;
    .bean-box {
      width: 100%;
      display: flex;
      .bean-font-img {
        // min-width: 79px;
        flex-shrink: 0;
      }
      .bean-box-title {
        margin-left: 40px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-end;
        .bean-font-title {
          width: 100%;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .bean-font-subtitle {
          width: 100%;
          font-size: 16px;
          margin-bottom: 6px;
          color: #a4a4a4;
        }
      }
    }
  }
  .bean-footer {
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: 100%;
    .bean-footer-box{
      width: 100%;
      flex-wrap: wrap;
    }
    .bean-footer-item {
      width: 100%;
      flex-wrap: wrap;
      .bean-footer-item-title {
        width: 100%;
        font-size: 21px;
        font-weight: 700;
        color: #333;
        margin: 10px 0px 20px 0px;
      }
      .bean-footer-item-subtitle {
        width: 100%;
        font-size: 18px;
        color: #939393;
      }
    }
  }
}
.bean-footer-img {
  margin: 20vh 0px;
  >img{
    margin:0px 3vw
  }
}
.button-box {
  width: 100%;
  flex-wrap: wrap;
  .button {
    width: 120px;
    height: 30px;
    background-color: #45a03c;
    color: #fff;
    border-radius: 25px;
  }
  .button-title {
    width: 100%;
    text-align: center;
    margin-top: 30px;
    font-size: 14px;
    color: #adb1b3;
  }
}
</style>
<style></style>
