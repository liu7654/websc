import { createRouter, createWebHistory } from "vue-router";
import { readToken } from "@/utils/token";

// 路由表：涵盖首页、分类、搜索、详情、购物车等核心页面
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: { title: "首页" }
  },
  {
    path: "/category/:id?",
    name: "category",
    component: () => import("@/views/Category.vue"),
    meta: { title: "分类" }
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/Search.vue"),
    meta: { title: "搜索结果" }
  },
  {
    path: "/product/:id",
    name: "productDetail",
    component: () => import("@/views/ProductDetail.vue"),
    meta: { title: "商品详情" }
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/Cart.vue"),
    meta: { title: "购物车" }
  },
  {
    path: "/orders",
    name: "orders",
    component: () => import("@/views/Orders.vue"),
    meta: { title: "订单中心", requiresAuth: true }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: { title: "登录", guestOnly: true, hideNavBar: true }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register.vue"),
    meta: { title: "注册", guestOnly: true, hideNavBar: true }
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/Profile.vue"),
    meta: { title: "个人中心", requiresAuth: true }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/NotFound.vue"),
    meta: { title: "页面不存在" }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  const session = readToken();
  const isLoggedIn = Boolean(session?.token);
  document.title = to.meta?.title ? `${to.meta.title} · Web 商城` : "Web 商城";

  // 中文提示：路由守卫控制登录权限
  if (to.meta?.requiresAuth && !isLoggedIn) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  if (to.meta?.guestOnly && isLoggedIn) {
    return next({ name: "home" });
  }

  return next();
});

export default router;
