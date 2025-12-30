import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from "../api/bookApi";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function BooksPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: getAllBooks
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Error loading books</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h5">Books</Typography>
      {data.map(b => (
        <Box key={b.book_id} p={1} mt={1} border="1px solid #ddd">
          <Typography>{b.book_name}</Typography>
          <Typography variant="caption">{b.category_name}</Typography>
        </Box>
      ))}
    </Box>
  );
}
