import http from "./http";

export const fetchAddresses = (params = {}) =>
  http.get("/user/addresses", { params }).then((res) => res.data);

export const saveAddress = (payload) => {
  if (payload.id) {
    return http
      .put(`/user/addresses/${payload.id}`, payload)
      .then((res) => res.data);
  }
  return http.post("/user/addresses", payload).then((res) => res.data);
};

export const deleteAddress = (id, params = {}) =>
  http.delete(`/user/addresses/${id}`, { params }).then((res) => res.data);

export const fetchFavorites = (params = {}) =>
  http.get("/user/favorites", { params }).then((res) => res.data);

export const toggleFavorite = (payload) =>
  http.post("/user/favorites/toggle", payload).then((res) => res.data);
