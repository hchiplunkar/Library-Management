import { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import BookList from "../components/BookList";
import UserList from "../components/UserList";

export default function DashboardPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <Box p={2}>
      <Typography variant="h5">Dashboard</Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <BookList refresh={refresh} onEdit={() => {}} onReserve={() => {}} />
        </Grid>

        <Grid item xs={12} md={4}>
          <UserList refresh={refresh} onEdit={() => {}} />
        </Grid>
      </Grid>
    </Box>
  );
}
