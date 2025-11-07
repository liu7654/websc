import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./styles/main.css";

// 应用入口：创建 Vue 实例并挂载 Pinia、路由及全局样式
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");