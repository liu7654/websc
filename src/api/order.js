import http from "./http";

export const fetchOrders = (params = {}) =>
  http.get("/orders", { params }).then((res) => res.data);

export const fetchOrderDetail = (id) =>
  http.get(`/orders/${id}`).then((res) => res.data);

export const createOrder = (payload) =>
  http.post("/orders", payload).then((res) => res.data);

export const payOrder = (id) =>
  http.post(`/orders/${id}/pay`).then((res) => res.data);

export const cancelOrder = (id) =>
  http.post(`/orders/${id}/cancel`).then((res) => res.data);
