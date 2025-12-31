import { useState, useEffect } from "react";
import { Box, TextField, Button, Alert } from "@mui/material";
import { reserveBook } from "../api/reservationApi";

export default function ReservationForm({ initialBook, onSuccess }) {
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState(initialBook ? initialBook.book_id : "");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (initialBook) setBookId(initialBook.book_id);
  }, [initialBook]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!userId || !bookId) return setError("user_id and book_id are required");
    try {
      const payload = { user_id: parseInt(userId), book_id: parseInt(bookId) };
      const resp = await reserveBook(payload);
      setSuccess(`Reserved id=${resp.reservation_id}`);
      onSuccess && onSuccess(resp);
    } catch (err) {
      setError(err.message || "Reservation failed");
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TextField label="User ID" value={userId} onChange={e => setUserId(e.target.value)} size="small" />
      <TextField label="Book ID" value={bookId} onChange={e => setBookId(e.target.value)} size="small" />
      <Button type="submit" variant="contained">Reserve</Button>
    </Box>
  );
}
