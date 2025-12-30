import httpClient from "./httpClient";

export const getAllUsers = () =>
  httpClient.get("/users").then(res => res.data);

export const getUser = (user_id) =>
  httpClient.get(`/users/${user_id}`).then(res => res.data);

export const addUser = (payload) =>
  httpClient.post("/users", payload).then(res => res.data);

export const updateUser = (user_id, payload) =>
  httpClient.put(`/users/${user_id}`, payload).then(res => res.data);

export const deleteUser = (user_id) =>
  httpClient.delete(`/users/${user_id}`).then(res => res.data);
