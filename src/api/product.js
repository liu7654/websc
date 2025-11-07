import http from "./http";

export const fetchProducts = (params = {}) =>
  http
    .get("/products", { params })
    .then((res) => res.data);

export const fetchProductDetail = (id) =>
  http.get(`/products/${id}`).then((res) => res.data);

export const fetchRecommendations = ({ productId, limit = 4 } = {}) =>
  http
    .get(`/products/${productId}/recommendations`, { params: { limit } })
    .then((res) => res.data);

export const fetchComments = (productId) =>
  http.get(`/products/${productId}/comments`).then((res) => res.data);
