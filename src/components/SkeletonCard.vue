<template>
  <div class="skeleton-card">
    <div class="skeleton-card__image skeleton-shimmer"></div>
    <div class="skeleton-card__content">
      <div class="skeleton-card__title skeleton-shimmer"></div>
      <div class="skeleton-card__desc skeleton-shimmer"></div>
      <div class="skeleton-card__desc skeleton-shimmer short"></div>
      <div class="skeleton-card__footer">
        <div class="skeleton-card__price skeleton-shimmer"></div>
        <div class="skeleton-card__button skeleton-shimmer"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: #fff;
}

.skeleton-card__image {
  width: 100%;
  height: 200px;
  border-radius: 18px;
  margin-bottom: 10px;
}

.skeleton-card__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-card__title {
  height: 20px;
  border-radius: 8px;
  width: 70%;
}

.skeleton-card__desc {
  height: 14px;
  border-radius: 6px;
  width: 100%;
}

.skeleton-card__desc.short {
  width: 60%;
}

.skeleton-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.skeleton-card__price {
  height: 24px;
  border-radius: 8px;
  width: 80px;
}

.skeleton-card__button {
  height: 36px;
  border-radius: 999px;
  width: 120px;
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

