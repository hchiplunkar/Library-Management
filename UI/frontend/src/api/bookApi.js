import httpClient from "./httpClient";

export const getAllBooks = () =>
  httpClient.get("/books").then(res => res.data);

export const getBook = (book_id) =>
  httpClient.get(`/books/${book_id}`).then(res => res.data);

export const addBook = (payload) =>
  httpClient.post("/books", payload).then(res => res.data);

export const updateBook = (book_id, payload) =>
  httpClient.put(`/books/${book_id}`, payload).then(res => res.data);

export const deleteBook = (book_id) =>
  httpClient.delete(`/books/${book_id}`).then(res => res.data);

export const getAllCategories = () =>
  httpClient.get("/categories").then(res => res.data);
