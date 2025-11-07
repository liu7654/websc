<template>
  <div class="cart-item">
    <div class="info">
      <div class="info__image">
        <LazyImage :src="item.cover" :alt="item.name" />
      </div>
      <div class="info__content">
        <h4>{{ item.name }}</h4>
        <p class="info__price">￥{{ item.price }}</p>
        <p class="info__subtotal">小计：￥{{ (item.price * item.count).toFixed(2) }}</p>
      </div>
    </div>
    <div class="actions">
      <div class="quantity-control">
        <button
          class="quantity-btn"
          :disabled="item.count <= 1"
          @click="update(item.count - 1)"
          aria-label="减少数量"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>
        <input
          type="number"
          class="quantity-input"
          :value="item.count"
          min="1"
          :max="item.stock || 99"
          @change="handleInputChange"
          @blur="validateInput"
        />
        <button
          class="quantity-btn"
          :disabled="item.count >= (item.stock || 99)"
          @click="update(item.count + 1)"
          aria-label="增加数量"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
        </button>
      </div>
      <button class="delete-btn" @click="handleDelete" aria-label="删除商品">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
        </svg>
      </button>
    </div>
  </div>
  <ConfirmDialog
    ref="confirmDialog"
    title="删除商品"
    :message="`确定要从购物车中移除「${item.name}」吗？`"
    confirm-text="删除"
    cancel-text="取消"
    @confirm="confirmDelete"
  />
</template>

<script setup>
import { ref } from "vue";
import LazyImage from "./LazyImage.vue";
import ConfirmDialog from "./ConfirmDialog.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["update-count", "remove"]);
const confirmDialog = ref(null);

const update = (value) => {
  const maxStock = props.item.stock || 99;
  const newValue = Math.max(1, Math.min(value, maxStock));
  if (newValue !== props.item.count) {
    emit("update-count", props.item.id, newValue);
  }
};

const handleInputChange = (event) => {
  const value = parseInt(event.target.value) || 1;
  update(value);
};

const validateInput = (event) => {
  if (!event.target.value || event.target.value < 1) {
    event.target.value = props.item.count;
  }
};

const handleDelete = () => {
  confirmDialog.value?.show();
};

const confirmDelete = () => {
  emit("remove", props.item.id);
};
</script>

<style scoped>
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  background: #fff;
  transition: all 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}

.info {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
}

.info__image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.info__content {
  flex: 1;
}

.info__content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #0f172a;
}

.info__price {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ef4444;
}

.info__subtotal {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 2px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f9fafb;
  padding: 4px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.quantity-btn:not(:disabled):hover {
  background: #fff;
  color: #ff7a18;
}

.quantity-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-btn svg {
  width: 16px;
  height: 16px;
}

.quantity-input {
  width: 50px;
  text-align: center;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  outline: none;
}

.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.delete-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #fee2e2;
  background: #fef2f2;
  color: #ef4444;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.delete-btn:hover {
  background: #ef4444;
  color: #fff;
  transform: scale(1.05);
}

.delete-btn svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 640px) {
  .cart-item {
    flex-direction: column;
    align-items: stretch;
  }

  .actions {
    justify-content: space-between;
  }
}
</style>
