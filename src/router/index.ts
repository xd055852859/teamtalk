import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "welcome",
    component: () => import("@/views/welcome.vue"),
    children: [],
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home.vue"),
    children: [],
  },
  {
    path: "/partner",
    name: "partner",
    component: () => import("@/views/partner.vue"),
    children: [],
  },
  {
    path: "/member/:id",
    name: "member",
    component: () => import("@/views/member.vue"),
    children: [],
  },
  {
    path: "/createGroup",
    name: "createGroup",
    component: () => import("@/views/createGroup.vue"),
    children: [],
  },
  {
    path: "/createCard",
    name: "createCard",
    component: () => import("@/views/createCard.vue"),
    children: [],
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("@/views/contact.vue"),
    children: [],
  },
  {
    path: "/manage/:id",
    name: "manage",
    component: () => import("@/views/manage.vue"),
    children: [],
  },
  {
    path: "/info/:id",
    name: "info",
    component: () => import("@/views/info.vue"),
    children: [],
  },
  {
    path: "/invite",
    name: "invite",
    component: () => import("@/views/invite.vue"),
    children: [],
  },
  {
    path: "/inviteOut",
    name: "inviteOut",
    component: () => import("@/views/inviteOut.vue"),
    children: [],
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test.vue"),
    children: [],
  },
  {
    path: "/block",
    name: "block",
    component: () => import("@/views/block.vue"),
    children: [],
  },
];
const routerHistory = createWebHashHistory();
const router = createRouter({
  history: routerHistory,
  routes,
});
//全局前置守卫
// router.beforeEach((to, from, next) => {
//   const { user, token } = store.state;
//   const { redirectAlreadyLogin, requiredLogin } = to.meta;
//   console.log(user);
//   console.log(token);
//   if (!user.isLogin) {
//     if (token) {
//       next("/");
//     } else {
//         next("login");
//     }
//     // } else if (redirectAlreadyLogin) {
//     //   next("/");
//   } else {
//     next();
//   }
// });
export default router;
