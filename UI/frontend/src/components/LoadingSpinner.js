import { CircularProgress, Box } from "@mui/material";

export default function LoadingSpinner() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <CircularProgress />
    </Box>
  );
}
