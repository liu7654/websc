<template>
  <section class="nav-shell">
    <div class="nav-banner">
      <p class="hero__tag">Web 商城 · Vue3 Demo</p>
      <p class="hero__slogan desktop-hidden">体验完整购物流程</p>
      <p class="hero__slogan mobile-hidden">好物不停 · 体验完整购物流程</p>
    </div>

    <header class="nav" role="navigation" aria-label="主导航">
      <RouterLink class="logo" to="/" aria-label="返回首页">
        <img src="/logo.svg" alt="" aria-hidden="true" />
        <span>Web 商城</span>
      </RouterLink>

      <button
        class="mobile-menu-btn mobile-visible"
        @click="toggleMobileMenu"
        aria-label="菜单"
        :aria-expanded="mobileMenuOpen"
      >
        <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
        </svg>
      </button>

      <nav class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }" role="menu">
        <RouterLink to="/" @click="closeMobileMenu" role="menuitem">首页</RouterLink>
        <RouterLink to="/category" @click="closeMobileMenu" role="menuitem">全部商品</RouterLink>
        <RouterLink to="/orders" @click="closeMobileMenu" role="menuitem">订单</RouterLink>
        
        <form class="search mobile-visible" @submit.prevent="handleSearch">
          <input 
            v-model="keyword" 
            placeholder="搜索商品 / 品牌 / 关键词"
            aria-label="搜索商品"
          />
          <button type="submit" aria-label="搜索">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
          </button>
        </form>

        <div class="actions mobile-visible">
          <template v-if="authStore.isLoggedIn">
            <RouterLink to="/profile" class="profile-link" @click="closeMobileMenu">{{ displayName }}</RouterLink>
            <button class="ghost" @click="handleLogout">退出</button>
          </template>
          <template v-else>
            <button class="ghost" type="button" @click="handleQuickLogin">体验登录</button>
            <RouterLink to="/login" @click="closeMobileMenu">登录</RouterLink>
            <RouterLink to="/register" @click="closeMobileMenu">注册</RouterLink>
          </template>
        </div>
      </nav>

      <form class="search mobile-hidden" @submit.prevent="handleSearch">
        <input 
          v-model="keyword" 
          placeholder="搜索商品 / 品牌 / 关键词"
          aria-label="搜索商品"
        />
      </form>

      <RouterLink 
        class="cart-link" 
        :class="{ 'is-updated': cartHighlight }" 
        to="/cart"
        :aria-label="`购物车，${cartCount}件商品`"
      >
        <span>购物车</span>
        <sup v-if="cartCount">{{ cartCount }}</sup>
      </RouterLink>

      <div class="actions mobile-hidden">
        <template v-if="authStore.isLoggedIn">
          <RouterLink to="/profile" class="profile-link">{{ displayName }}</RouterLink>
          <button class="ghost" @click="handleLogout">退出</button>
        </template>
        <template v-else>
          <button class="ghost" type="button" @click="handleQuickLogin">体验登录</button>
          <RouterLink to="/login">登录</RouterLink>
          <RouterLink to="/register">注册</RouterLink>
        </template>
      </div>
    </header>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const keyword = ref("");
const mobileMenuOpen = ref(false);

const displayName = computed(
  () => authStore.profile?.nickname || authStore.profile?.username || "个人中心"
);
const cartCount = computed(() => cartStore.totalQuantity);
const cartHighlight = ref(false);

const handleSearch = () => {
  if (!keyword.value) return;
  router.push({ name: "search", query: { q: keyword.value } });
  keyword.value = "";
  closeMobileMenu();
};

const handleQuickLogin = async () => {
  try {
    await authStore.login({ username: "demo", password: "123456" });
    router.replace("/");
    closeMobileMenu();
  } catch (error) {
    console.error(error);
  }
};

const handleLogout = () => {
  authStore.logout();
  closeMobileMenu();
  router.push({ name: "login" });
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

watch(
  cartCount,
  (value, oldValue) => {
    if (value > oldValue) {
      cartHighlight.value = true;
      setTimeout(() => {
        cartHighlight.value = false;
      }, 600);
    }
  },
  { flush: "post" }
);

// 监听路由变化，关闭移动菜单
watch(() => router.currentRoute.value.path, () => {
  closeMobileMenu();
});
</script>

<style scoped>
.nav-shell {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 32px;
  background: linear-gradient(135deg, #fef3c7, #f3e8ff);
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.15);
  padding: 20px 40px 32px;
}

.nav-banner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: baseline;
  color: #7c2d12;
  font-weight: 600;
}

.hero__tag {
  margin: 0;
  letter-spacing: 0.2em;
  font-size: 13px;
}

.hero__slogan {
  margin: 0;
  font-size: 18px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  text-decoration: none;
  color: #111;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-links a {
  text-decoration: none;
  color: #334155;
  font-weight: 500;
}

.search {
  flex: 1;
  min-width: 220px;
  display: flex;
}

.search input {
  border-radius: 999px;
  padding: 10px 18px;
  border: 1px solid #e2e8f0;
  width: 100%;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search input:focus {
  border-color: #94a3ff;
  box-shadow: 0 0 0 3px rgba(148, 163, 255, 0.3);
}

.cart-link {
  position: relative;
  text-decoration: none;
  color: #0f172a;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.cart-link.is-updated {
  transform: scale(1.08);
}

.cart-link sup {
  background: #ef4444;
  color: #fff;
  border-radius: 999px;
  padding: 1px 6px;
  font-size: 12px;
  position: absolute;
  top: -8px;
  right: -16px;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.profile-link {
  font-weight: 600;
}

.nav-shell .logo {
  font-size: 18px;
}

.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  margin-left: auto;
}

.mobile-menu-btn svg {
  width: 24px;
  height: 24px;
  color: #0f172a;
}

/* 默认隐藏移动端专用元素 */
.mobile-visible {
  display: none !important;
}

@media (max-width: 768px) {
  /* 移动端显示移动端专用元素 */
  .mobile-visible {
    display: flex !important;
  }

  .mobile-hidden {
    display: none !important;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-shell {
    padding: 16px 20px;
    border-radius: 20px;
  }

  .nav-banner {
    flex-direction: column;
    gap: 4px;
  }

  .hero__tag {
    font-size: 11px;
  }

  .hero__slogan {
    font-size: 14px;
  }

  .nav {
    position: relative;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: #fff;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
    padding: 24px;
    flex-direction: column;
    gap: 24px;
    transition: right 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
  }

  .nav-links.mobile-open {
    right: 0;
  }

  .nav-links a {
    font-size: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .nav-links .search {
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .nav-links .search input {
    border-radius: 12px;
    padding: 12px 16px;
  }

  .nav-links .actions {
    padding-top: 12px;
    flex-direction: column;
    gap: 12px;
  }

  .nav-links .actions button,
  .nav-links .actions a {
    width: 100%;
    text-align: center;
    padding: 12px;
  }

  .cart-link {
    margin-right: 12px;
  }
}
</style>
