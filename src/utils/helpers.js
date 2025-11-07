// 通用工具函数：延迟、LocalStorage 读写、ID 生成等
export const sleep = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const loadFromStorage = (key, defaultValue = null) => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (error) {
    console.warn("读取本地存储失败", error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("写入本地存储失败", error);
  }
};

export const removeFromStorage = (key) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
};

export const generateFriendlyId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;

export const deepClone = (payload) => JSON.parse(JSON.stringify(payload));
