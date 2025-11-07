import http from "./http";

export const loginUser = (payload) =>
  http.post("/auth/login", payload).then((res) => res.data);

export const registerUser = (payload) =>
  http.post("/auth/register", payload).then((res) => res.data);

export const fetchUserProfile = (id) =>
  http.get(`/auth/profile/${id}`).then((res) => res.data);

export const updatePassword = (payload) =>
  http.post("/auth/password", payload).then((res) => res.data);
