import { useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

export default function DashboardPage() {
  const [data] = useState(null);

  return (
    <>
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
