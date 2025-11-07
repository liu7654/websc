import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { readToken, saveToken, clearToken } from "@/utils/token";
import { loginUser, registerUser, fetchUserProfile, updatePassword } from "@/api/auth";

// 用户鉴权仓库：统一管理 token、用户资料与登录注册流程
export const useAuthStore = defineStore("auth", () => {
  // 初始化时尝试从本地恢复会话，保持刷新后也能记住登录状态
  const session = readToken();
  const token = ref(session?.token || "");
  const profile = ref(session?.user || null);
  const loading = ref(false);

  const isLoggedIn = computed(() => Boolean(token.value));

  // 中文提示：统一处理登录、注册、登出、资料刷新等动作
  const login = async (payload) => {
    loading.value = true;
    try {
      const result = await loginUser(payload);
      token.value = result.token;
      profile.value = result.user;
      saveToken(result);
      return result;
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload) => {
    loading.value = true;
    try {
      const result = await registerUser(payload);
      token.value = result.token;
      profile.value = result.user;
      saveToken(result);
      return result;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = "";
    profile.value = null;
    clearToken();
  };

  const refreshProfile = async () => {
    if (!token.value) return null;
    const userId = profile.value?.id || readToken()?.user?.id;
    if (!userId) return null;
    const data = await fetchUserProfile(userId);
    profile.value = data;
    saveToken({ token: token.value, user: data });
    return data;
  };

  const changePassword = (payload) => updatePassword(payload);

  return {
    token,
    profile,
    loading,
    isLoggedIn,
    login,
    register,
    logout,
    refreshProfile,
    changePassword
  };
});
