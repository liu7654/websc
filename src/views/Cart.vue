<template>
  <section>
    <header class="section__header">
      <div>
        <h2>购物清单</h2>
        <p v-if="cartStore.items.length" class="cart-info">
          共 <strong>{{ cartStore.totalQuantity }}</strong> 件商品
        </p>
      </div>
      <button
        v-if="cartStore.items.length"
        class="clear-btn"
        @click="handleClearCart"
      >
        清空购物车
      </button>
    </header>

    <div v-if="cartStore.items.length" class="cart-list">
      <TransitionGroup name="cart-item">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
          @remove="cartStore.removeItem"
          @update-count="cartStore.updateCount"
        />
      </TransitionGroup>
      <footer class="checkout">
        <div class="checkout__info">
          <div class="checkout__row">
            <span>商品总数</span>
            <span>{{ cartStore.totalQuantity }} 件</span>
          </div>
          <div class="checkout__row checkout__total">
            <span>合计</span>
            <strong>￥{{ cartStore.totalAmount }}</strong>
          </div>
        </div>
        <RouterLink to="/orders" class="checkout__btn">
          去结算
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
          </svg>
        </RouterLink>
      </footer>
    </div>
    <div v-else class="empty">
      <svg
        class="empty__icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3>购物车空空如也</h3>
      <p>快去挑选心仪的商品吧</p>
      <RouterLink to="/category" class="empty__btn">去逛逛</RouterLink>
    </div>
  </section>

  <ConfirmDialog
    ref="clearDialog"
    title="清空购物车"
    message="确定要清空购物车中的所有商品吗？此操作不可恢复。"
    confirm-text="确定清空"
    cancel-text="取消"
    @confirm="confirmClear"
  />
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useCartStore } from "@/store/cart";
import CartItem from "@/components/CartItem.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const cartStore = useCartStore();
const clearDialog = ref(null);

const handleClearCart = () => {
  clearDialog.value?.show();
};

const confirmClear = () => {
  cartStore.clear();
};
</script>

<style scoped>
.section__header {
  margin-bottom: 24px;
}

.cart-info {
  color: #64748b;
}

.cart-info strong {
  color: #ff7a18;
}

.clear-btn {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item-move,
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.cart-item-leave-active {
  position: absolute;
  width: 100%;
}

.checkout {
  margin-top: 32px;
  padding: 24px;
  border-radius: 20px;
  background: linear-gradient(135deg, #fff5f0 0%, #fff 100%);
  border: 2px solid #ff7a18;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.checkout__info {
  flex: 1;
}

.checkout__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #64748b;
}

.checkout__row:last-child {
  margin-bottom: 0;
}

.checkout__total {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #fed7aa;
  font-size: 18px;
  color: #0f172a;
}

.checkout__total strong {
  font-size: 24px;
  color: #ef4444;
}

.checkout__btn {
  background: linear-gradient(135deg, #ff7a18, #ffb347);
  color: #fff;
  padding: 14px 32px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkout__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 122, 24, 0.3);
}

.checkout__btn svg {
  width: 18px;
  height: 18px;
}

.empty {
  padding: 80px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty__icon {
  width: 96px;
  height: 96px;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.empty h3 {
  margin: 0;
  font-size: 22px;
  color: #0f172a;
}

.empty p {
  margin: 0;
  color: #64748b;
}

.empty__btn {
  margin-top: 16px;
  background: linear-gradient(135deg, #ff7a18, #ffb347);
  color: #fff;
  padding: 12px 32px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.empty__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 122, 24, 0.3);
}

@media (max-width: 640px) {
  .checkout {
    flex-direction: column;
    align-items: stretch;
  }

  .checkout__btn {
    justify-content: center;
  }
}
</style>
