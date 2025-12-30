import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function UsersPage() {
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState(null);

  function handleSuccess() {
    setRefresh(r => r + 1);
    setSelected(null);
  }

  return (
    <Box p={2}>
      <Typography variant="h5">Users</Typography>
      <Box display="flex" gap={2} mt={2}>
        <Box flex={1}>
          <UserList refresh={refresh} onEdit={setSelected} />
        </Box>
        <Box width={320}>
          <UserForm onSuccess={handleSuccess} initialData={selected} />
        </Box>
      </Box>
    </Box>
  );
}
