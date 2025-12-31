import BookList from "../components/BookList";
import BookForm from "../components/BookForm";
import ReservationForm from "../components/ReservationForm";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function BooksPage() {
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState(null);
  const [selectedForReservation, setSelectedForReservation] = useState(null);

  function handleSuccess() {
    setRefresh(r => r + 1);
    setSelected(null);
  }

  return (
    <Box p={2}>
      <Typography variant="h5">Books</Typography>
      <Box display="flex" gap={2} mt={2}>
        <Box flex={1}>
          <BookList refresh={refresh} onEdit={setSelected} onReserve={setSelectedForReservation} />
        </Box>
        <Box width={320} display="flex" flexDirection="column" gap={2}>
          <BookForm onSuccess={handleSuccess} initialData={selected} />
          <ReservationForm initialBook={selectedForReservation} onSuccess={() => setSelectedForReservation(null)} />
        </Box>
      </Box>
    </Box>
  );
}
