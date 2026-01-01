import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useNavigate } from "react-router-dom";
import { mockBooks, mockUsers, mockBorrowRecords } from "../data/mockData";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
  onClick?: () => void;
}

function StatCard({ icon, title, value, description, onClick }: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { boxShadow: 3 } : {},
        height: "100%",
      }}
    >
      <CardContent>
        <Stack spacing={0.5}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "primary.light",
                borderRadius: 1,
                display: "flex",
              }}
            >
              {icon}
            </Box>
            <Typography color="text.secondary" variant="caption">
              {title}
            </Typography>
          </Box>
          <Typography variant="h4">{value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function LibraryMainDashboard() {
  const navigate = useNavigate();

  const overdueBorrows = mockBorrowRecords.filter(
    (record) => record.status === "overdue"
  ).length;
  const activeBorrows = mockBorrowRecords.filter(
    (record) => record.status === "borrowed"
  ).length;

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
          spacing={2}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Dashboard Overview
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate("/library/books")}
            >
              New Book
            </Button>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate("/library/users")}
            >
              New User
            </Button>
          </Stack>
        </Stack>

        {/* Statistics Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<BookRoundedIcon sx={{ color: "primary.main" }} />}
              title="Total Books"
              value={mockBooks.length}
              description="Books in collection"
              onClick={() => navigate("/library/books")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<PeopleRoundedIcon sx={{ color: "success.main" }} />}
              title="Active Users"
              value={mockUsers.filter((u) => u.status === "active").length}
              description="Library members"
              onClick={() => navigate("/library/users")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<BookRoundedIcon sx={{ color: "info.main" }} />}
              title="Borrowed Books"
              value={activeBorrows}
              description="Currently borrowed"
              onClick={() => navigate("/library/borrow-return")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<WarningRoundedIcon sx={{ color: "error.main" }} />}
              title="Overdue Books"
              value={overdueBorrows}
              description="Past due date"
              onClick={() => navigate("/library/borrow-return")}
            />
          </Grid>
        </Grid>

        {/* Quick Links */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Navigation
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/library/users")}
                >
                  Manage Users
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/library/books")}
                >
                  Manage Books
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/library/categories")}
                >
                  Manage Categories
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/library/authors")}
                >
                  Manage Authors
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/library/publishers")}
                >
                  Manage Publishers
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/library/borrow-return")}
                >
                  Borrow/Return Books
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
