import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/userApi";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function UsersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Error loading users</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h5">Users</Typography>
      {data.map(u => (
        <Box key={u.user_id} p={1} mt={1} border="1px solid #ddd">
          <Typography>{u.name}</Typography>
        </Box>
      ))}
    </Box>
  );
}
