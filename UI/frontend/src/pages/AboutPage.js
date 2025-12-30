import { Typography } from "@mui/material";

export default function AboutPage() {
  return (
    <>
      <Typography variant="h4">About</Typography>
      <Typography sx={{ mt: 2 }}>
        React → Node.js BFF → gRPC → Python Microservices
      </Typography>
    </>
  );
}
