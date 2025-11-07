<template>
  <section class="section profile-section">
    <header class="section__header">
      <h2>个人中心</h2>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </header>

    <!-- 用户信息卡片 -->
    <article class="profile-card" v-if="authStore.profile">
      <div class="profile-card__header">
        <div class="profile-avatar">
          {{ (authStore.profile.nickname || authStore.profile.username).charAt(0).toUpperCase() }}
        </div>
        <div class="profile-info">
          <h3>{{ authStore.profile.nickname || authStore.profile.username }}</h3>
          <p>{{ authStore.profile.email }}</p>
        </div>
        <button class="edit-btn" @click="showEditProfile = true">编辑资料</button>
      </div>
      <div class="profile-card__body">
        <div class="info-item">
          <span class="label">用户名</span>
          <span class="value">{{ authStore.profile.username }}</span>
        </div>
        <div class="info-item">
          <span class="label">邮箱</span>
          <span class="value">{{ authStore.profile.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">手机号</span>
          <span class="value">{{ authStore.profile.phone || "未绑定" }}</span>
        </div>
      </div>
    </article>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <button class="action-card" @click="showEditProfile = true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        <span>编辑资料</span>
      </button>
      <button class="action-card" @click="showAddressManager = true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
        <span>地址管理</span>
      </button>
      <button class="action-card" @click="showChangePassword = true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
        </svg>
        <span>修改密码</span>
      </button>
    </div>

    <!-- 收藏夹 -->
    <section class="favorites-section">
      <header class="section__header">
        <h3>我的收藏</h3>
      </header>
      <div v-if="userStore.favorites.length" class="favorites-grid">
        <div v-for="product in userStore.favorites" :key="product.id" class="favorite-item">
          <img :src="product.cover" :alt="product.name" />
          <div class="favorite-info">
            <h4>{{ product.name }}</h4>
            <p class="price">￥{{ product.price }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p>暂无收藏商品</p>
      </div>
    </section>
  </section>

  <!-- 编辑资料弹窗 -->
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="showEditProfile" class="modal-overlay" @click="showEditProfile = false">
        <div class="modal" @click.stop>
          <div class="modal__header">
            <h3>编辑资料</h3>
            <button class="close-btn" @click="showEditProfile = false">×</button>
          </div>
          <div class="modal__body">
            <FormInput
              v-model="editForm.nickname"
              label="昵称"
              placeholder="请输入昵称"
            />
            <FormInput
              v-model="editForm.email"
              label="邮箱"
              type="email"
              placeholder="请输入邮箱"
            />
            <FormInput
              v-model="editForm.phone"
              label="手机号"
              placeholder="请输入手机号"
            />
          </div>
          <div class="modal__footer">
            <button class="btn-secondary" @click="showEditProfile = false">取消</button>
            <button class="btn-primary" @click="handleUpdateProfile">保存</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- 地址管理弹窗 -->
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="showAddressManager" class="modal-overlay" @click="showAddressManager = false">
        <div class="modal modal--large" @click.stop>
          <div class="modal__header">
            <h3>地址管理</h3>
            <button class="close-btn" @click="showAddressManager = false">×</button>
          </div>
          <div class="modal__body">
            <div class="address-list">
              <div v-for="address in userStore.addresses" :key="address.id" class="address-card">
                <div class="address-info">
                  <h4>{{ address.receiver }} {{ address.phone }}</h4>
                  <p>{{ address.province }} {{ address.city }} {{ address.district }}</p>
                  <p>{{ address.detail }}</p>
                </div>
                <div class="address-actions">
                  <button class="btn-text" @click="editAddress(address)">编辑</button>
                  <button class="btn-text btn-danger" @click="deleteAddress(address.id)">删除</button>
                </div>
              </div>
              <div v-if="!userStore.addresses.length" class="empty-state">
                <p>暂无收货地址</p>
              </div>
            </div>
            <button class="btn-add" @click="showAddAddress = true">+ 新增地址</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- 修改密码弹窗 -->
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="showChangePassword" class="modal-overlay" @click="showChangePassword = false">
        <div class="modal" @click.stop>
          <div class="modal__header">
            <h3>修改密码</h3>
            <button class="close-btn" @click="showChangePassword = false">×</button>
          </div>
          <div class="modal__body">
            <FormInput
              v-model="passwordForm.oldPassword"
              label="当前密码"
              type="password"
              placeholder="请输入当前密码"
            />
            <FormInput
              v-model="passwordForm.newPassword"
              label="新密码"
              type="password"
              placeholder="请输入新密码（至少6位）"
            />
            <FormInput
              v-model="passwordForm.confirmPassword"
              label="确认密码"
              type="password"
              placeholder="请再次输入新密码"
            />
          </div>
          <div class="modal__footer">
            <button class="btn-secondary" @click="showChangePassword = false">取消</button>
            <button class="btn-primary" @click="handleChangePassword">确认修改</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { useToast } from "@/composables/useToast";
import FormInput from "@/components/FormInput.vue";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const { success, error } = useToast();

// 弹窗控制
const showEditProfile = ref(false);
const showAddressManager = ref(false);
const showChangePassword = ref(false);
const showAddAddress = ref(false);

// 编辑资料表单
const editForm = reactive({
  nickname: "",
  email: "",
  phone: ""
});

// 修改密码表单
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});

// 登出
const handleLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
};

// 更新资料
const handleUpdateProfile = () => {
  // 这里应该调用 API 更新
  if (authStore.profile) {
    authStore.profile.nickname = editForm.nickname;
    authStore.profile.email = editForm.email;
    authStore.profile.phone = editForm.phone;
    success("资料更新成功");
    showEditProfile.value = false;
  }
};

// 修改密码
const handleChangePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    error("两次输入的密码不一致");
    return;
  }
  if (passwordForm.newPassword.length < 6) {
    error("密码至少需要6个字符");
    return;
  }
  
  try {
    // authStore.changePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword });
    success("密码修改成功");
    showChangePassword.value = false;
    passwordForm.oldPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  } catch (err) {
    error("密码修改失败");
  }
};

// 编辑地址
const editAddress = (address) => {
  // 实现地址编辑逻辑
  console.log("编辑地址", address);
};

// 删除地址
const deleteAddress = (id) => {
  if (confirm("确定要删除这个地址吗？")) {
    userStore.removeAddress(id);
    success("地址删除成功");
  }
};

// 初始化表单数据
const initEditForm = () => {
  if (authStore.profile) {
    editForm.nickname = authStore.profile.nickname || authStore.profile.username;
    editForm.email = authStore.profile.email;
    editForm.phone = authStore.profile.phone || "";
  }
};

// 进入页面即同步地址与收藏数据
onMounted(() => {
  initEditForm();
  userStore.loadAddresses();
  userStore.loadFavorites();
});
</script>

<style scoped>
.profile-section {
  max-width: 900px;
  margin: 0 auto;
}

.logout-btn {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #ef4444;
  color: #fff;
}

/* 用户信息卡片 */
.profile-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 0;
  margin-bottom: 32px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.profile-card__header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px;
  color: #fff;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
}

.profile-info {
  flex: 1;
}

.profile-info h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
}

.profile-info p {
  margin: 0;
  opacity: 0.9;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.profile-card__body {
  background: #fff;
  padding: 24px 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item .label {
  font-size: 13px;
  color: #64748b;
}

.info-item .value {
  font-size: 16px;
  color: #0f172a;
  font-weight: 500;
}

/* 快捷操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.action-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #ff7a18;
}

.action-card svg {
  width: 32px;
  height: 32px;
  color: #ff7a18;
}

.action-card span {
  font-weight: 600;
  color: #0f172a;
}

/* 收藏夹 */
.favorites-section {
  margin-top: 32px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.favorite-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.favorite-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.favorite-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.favorite-info {
  padding: 12px;
}

.favorite-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-info .price {
  margin: 0;
  font-weight: 600;
  color: #ef4444;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #94a3b8;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #cbd5e1;
}

.empty-state p {
  margin: 0;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal--large {
  max-width: 700px;
}

.modal__header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal__header h3 {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.modal__body {
  padding: 24px;
}

.modal__footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #ff7a18, #ffb347);
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 122, 24, 0.3);
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

/* 地址列表 */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.address-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.address-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.address-info p {
  margin: 4px 0;
  color: #64748b;
  font-size: 14px;
}

.address-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.btn-text {
  border: none;
  background: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
}

.btn-text:hover {
  text-decoration: underline;
}

.btn-text.btn-danger {
  color: #ef4444;
}

.btn-add {
  width: 100%;
  padding: 12px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background: #f9fafb;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  border-color: #ff7a18;
  background: #fff5f0;
  color: #ff7a18;
}

/* 弹窗动画 */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-active .modal,
.dialog-leave-active .modal {
  transition: all 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .modal,
.dialog-leave-to .modal {
  transform: scale(0.9) translateY(-20px);
}

@media (max-width: 768px) {
  .profile-card__header {
    flex-direction: column;
    text-align: center;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .address-card {
    flex-direction: column;
  }

  .modal {
    max-width: 100%;
    border-radius: 20px 20px 0 0;
    margin-top: auto;
  }
}
</style>
