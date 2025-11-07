import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 中文注释：使用 @ 快速指向 src 目录
      "@": path.resolve(__dirname, "src")
    }
  },
  css: {
    postcss: null, // 禁用 PostCSS 配置
  },
  server: {
    // 开发服务器配置，便于局域网调试
    host: "0.0.0.0",
    port: 5174
  }
});
