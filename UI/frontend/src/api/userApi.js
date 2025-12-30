import httpClient from "./httpClient";

export const getAllUsers = () => {
  // Some backends may not support listing users yet; return empty array on error
  return httpClient
    .get("/users")
    .then(res => {
      const data = res.data;
      // normalize gateway response { users: [...] } to array
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.users)) return data.users;
      return [];
    })
    .catch(err => {
      console.warn("getAllUsers failed, returning empty list:", err.message);
      return [];
    });
};

export const getUser = (user_id) =>
  httpClient.get(`/users/${user_id}`).then(res => res.data);

export const addUser = (payload) =>
  httpClient.post("/users", payload).then(res => res.data);

export const updateUser = (user_id, payload) =>
  httpClient.put(`/users/${user_id}`, payload).then(res => res.data);

export const deleteUser = (user_id) =>
  httpClient.delete(`/users/${user_id}`).then(res => res.data);
