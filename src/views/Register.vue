<template>
  <section class="auth-card">
    <div class="auth-card__header">
      <h2>注册新用户</h2>
      <p class="tip">三步完成注册，立享全站优惠</p>
    </div>
    <form @submit.prevent="handleSubmit">
      <FormInput
        v-model="fields.username"
        label="用户名"
        type="text"
        icon="👤"
        placeholder="请输入昵称/用户名"
        hint="3-20个字符，只能包含字母、数字和下划线"
        :error="touched.username ? errors.username : ''"
        :disabled="authStore.loading"
        @blur="onBlur('username')"
      />
      <FormInput
        v-model="fields.email"
        label="邮箱"
        type="email"
        icon="📧"
        placeholder="用于找回密码"
        :error="touched.email ? errors.email : ''"
        :disabled="authStore.loading"
        @blur="onBlur('email')"
      />
      <FormInput
        v-model="fields.password"
        label="密码"
        type="password"
        icon="🔒"
        placeholder="至少 6 位"
        hint="建议使用字母、数字和符号的组合"
        :error="touched.password ? errors.password : ''"
        :disabled="authStore.loading"
        @blur="onBlur('password')"
      />
      <FormInput
        v-model="fields.confirm"
        label="确认密码"
        type="password"
        icon="🔐"
        placeholder="请再次输入密码"
        :error="touched.confirm ? errors.confirm : ''"
        :disabled="authStore.loading"
        @blur="onBlur('confirm')"
      />
      <button type="submit" :disabled="authStore.loading || hasErrors" class="submit-btn">
        <span v-if="authStore.loading" class="spinner-small"></span>
        {{ authStore.loading ? "提交中..." : "立即注册" }}
      </button>
    </form>
    <div class="auth-card__footer">
      <RouterLink to="/login">已有账号？去登录</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useFormValidation, validators } from "@/composables/useFormValidation";
import FormInput from "@/components/FormInput.vue";

const router = useRouter();
const authStore = useAuthStore();

const { fields, errors, touched, validateAll, onBlur, hasErrors } = useFormValidation({
  username: {
    defaultValue: "",
    rules: [validators.required("请输入用户名"), validators.username()]
  },
  email: {
    defaultValue: "",
    rules: [validators.required("请输入邮箱"), validators.email()]
  },
  password: {
    defaultValue: "",
    rules: [validators.required("请输入密码"), validators.password()]
  },
  confirm: {
    defaultValue: "",
    rules: [
      validators.required("请确认密码"),
      (value) => validators.match(fields.password, "两次密码不一致")(value)
    ]
  }
});

const handleSubmit = async () => {
  if (!validateAll()) return;

  try {
    await authStore.register({
      username: fields.username,
      email: fields.email,
      password: fields.password
    });
    router.replace("/");
  } catch (error) {
    // 错误已由 store 处理
  }
};
</script>

<style scoped>
.auth-card {
  max-width: 460px;
  margin: 0 auto;
  padding: 48px;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.auth-card__header {
  margin-bottom: 32px;
  text-align: center;
}

.auth-card__header h2 {
  margin: 0 0 12px 0;
  font-size: 28px;
  color: #0f172a;
}

.tip {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #ff7a18, #ffb347);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 122, 24, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-card__footer {
  margin-top: 24px;
  text-align: center;
}

.auth-card__footer a {
  color: #ff7a18;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.auth-card__footer a:hover {
  color: #ff9547;
  text-decoration: underline;
}
</style>
