<template>
  <div class="pager" v-if="pages > 1">
    <button :disabled="page === 1" @click="$emit('change', page - 1)">上一页</button>
    <span>{{ page }} / {{ pages }}</span>
    <button :disabled="page === pages" @click="$emit('change', page + 1)">下一页</button>
  </div>
</template>

<script setup>
// 简易翻页器：父组件监听 change 事件刷新数据
defineProps({
  page: { type: Number, default: 1 },
  pages: { type: Number, default: 1 }
});

defineEmits(["change"]);
</script>

<style scoped>
.pager {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
}
</style>
