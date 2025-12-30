import BookList from "../components/BookList";
import BookForm from "../components/BookForm";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function BooksPage() {
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState(null);

  function handleSuccess() {
    setRefresh(r => r + 1);
    setSelected(null);
  }

  return (
    <Box p={2}>
      <Typography variant="h5">Books</Typography>
      <Box display="flex" gap={2} mt={2}>
        <Box flex={1}>
          <BookList refresh={refresh} onEdit={setSelected} />
        </Box>
        <Box width={320}>
          <BookForm onSuccess={handleSuccess} initialData={selected} />
        </Box>
      </Box>
    </Box>
  );
}
