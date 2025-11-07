<template>
  <section class="empty">
    <h1>404</h1>
    <p>页面走丢啦</p>
    <RouterLink to="/">返回首页</RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.empty {
  text-align: center;
  padding: 80px 0;
}
</style>
