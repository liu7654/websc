import { loadFromStorage, saveToStorage, removeFromStorage } from "./helpers";

const TOKEN_KEY = "websc_auth";

// 会话工具：封装 token 的存取删除，方便仓库直接调用
export const readToken = () => loadFromStorage(TOKEN_KEY, { token: "", user: null });

export const saveToken = (session) => {
  if (!session?.token) return;
  saveToStorage(TOKEN_KEY, session);
};

export const clearToken = () => removeFromStorage(TOKEN_KEY);