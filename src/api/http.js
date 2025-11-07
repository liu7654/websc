import axios from "axios";
import { setupMockServer } from "@/mock/service";

const http = axios.create({
  baseURL: "/api",
  timeout: 1500
});

// 中文提示：在开发环境下使用 axios-mock-adapter 拦截请求
setupMockServer(http);

export default http;
