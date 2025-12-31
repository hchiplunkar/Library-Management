import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ReservationForm from "../components/ReservationForm";
import { getAllReservations, returnBook, deleteReservation } from "../api/reservationApi";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    load();
  }, [refresh]);

  async function load() {
    const data = await getAllReservations();
    // support responses like { reservations: [...] } or an array
    if (Array.isArray(data)) setReservations(data);
    else if (data && Array.isArray(data.reservations)) setReservations(data.reservations);
    else setReservations([]);
  }

  async function handleReturn(id) {
    await returnBook(id);
    setRefresh(r => r + 1);
  }

  async function handleDelete(id) {
    await deleteReservation(id);
    setRefresh(r => r + 1);
  }

  return (
    <Box p={2}>
      <Typography variant="h5">Reservations</Typography>

      <Box mt={2}>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Book ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.reservation_id}>
                <td>{r.reservation_id}</td>
                <td>{r.user_id}</td>
                <td>{r.book_id}</td>
                <td>{r.status || r.state || "-"}</td>
                <td>
                  <button onClick={() => handleReturn(r.reservation_id)}>Return</button>
                  <button onClick={() => handleDelete(r.reservation_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Box mt={2}>
        <Typography variant="h6">Create Reservation</Typography>
        <ReservationForm onSuccess={() => setRefresh(r => r + 1)} />
      </Box>
    </Box>
  );
}
