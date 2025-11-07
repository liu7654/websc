// 格式化工具：金额、时间等
export const toCurrency = (value) => Number(value || 0).toFixed(2);

export const toDateTime = (value) => {
  if (!value) return "--";
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
};

export const keepTwoDecimals = (value) => Number(value || 0).toFixed(2);
