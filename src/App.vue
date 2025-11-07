<template>
  <!-- 顶层布局：统一导航 + 内容区域 -->
  <div class="app-container">
    <NavBar v-if="!currentRoute?.meta?.hideNavBar" />
    <div class="app-shell">
      <main class="app-main" :class="{ 'no-navbar': currentRoute?.meta?.hideNavBar }">
        <RouterView v-slot="{ Component, route }">
          <Transition :name="route.meta.transition || 'fade'" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </main>
    </div>
    <Toast />
    <ScrollToTop />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import Toast from "@/components/Toast.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";

const route = useRoute();
const currentRoute = computed(() => route);
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-shell {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-main {
  width: 100%;
  flex: 1;
}

.app-main.no-navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>

<style>
/* 页面过渡动画 - 淡入淡出 (全局样式) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 页面过渡动画 - 滑动 (全局样式) */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>