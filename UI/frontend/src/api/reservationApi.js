import httpClient from "./httpClient";

export const reserveBook = (payload) =>
  httpClient.post("/reservations", payload).then(res => res.data);

export const getAllReservations = () =>
  httpClient.get("/reservations").then(res => res.data);

export const returnBook = (reservation_id) =>
  httpClient.post(`/reservations/${reservation_id}/return`, {}).then(res => res.data);

export const deleteReservation = (reservation_id) =>
  httpClient.delete(`/reservations/${reservation_id}`).then(res => res.data);

export default {
  reserveBook,
  getAllReservations,
  returnBook,
  deleteReservation
};
