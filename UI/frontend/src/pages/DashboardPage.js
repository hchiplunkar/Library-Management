import { useState } from "react";
import { Button, Grid, Card, CardContent, Typography } from "@mui/material";
import { fetchDashboard } from "../api/bffclient";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      console.log("DashboardPage: before fetchDashboard");
      setData(await fetchDashboard(1, 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={loadDashboard}>
        Load Dashboard
      </Button>

      {loading && <LoadingSpinner />}

      {data && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">👤 User</Typography>
                <Typography>ID: {data.user.user_id}</Typography>
                <Typography>Name: {data.user.name}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">📘 Book</Typography>
                <Typography>ID: {data.book.book_id}</Typography>
                <Typography>Title: {data.book.book_name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
}
