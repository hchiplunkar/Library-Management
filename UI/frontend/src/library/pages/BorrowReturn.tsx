import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
  MenuItem,
  Alert,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {
  BorrowRecord,
  mockBorrowRecords,
  mockUsers,
  mockBooks,
} from "../data/mockData";

interface FormData {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string;
  status: "borrowed" | "returned" | "overdue";
}

export default function BorrowReturn() {
  const [rows, setRows] = React.useState<BorrowRecord[]>(mockBorrowRecords);
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [returnDialogOpen, setReturnDialogOpen] = React.useState(false);
  const [returningId, setReturningId] = React.useState<string | null>(null);
  const [returnDate, setReturnDate] = React.useState("");
  const [formData, setFormData] = React.useState<FormData>({
    id: "",
    userId: "",
    bookId: "",
    borrowDate: "",
    dueDate: "",
    returnDate: "",
    status: "borrowed",
  });

  const handleAddBorrow = () => {
    setEditingId(null);
    setFormData({
      id: "",
      userId: "",
      bookId: "",
      borrowDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      returnDate: "",
      status: "borrowed",
    });
    setOpen(true);
  };

  const handleReturnBook = (id: string) => {
    setReturningId(id);
    setReturnDate(new Date().toISOString().split("T")[0]);
    setReturnDialogOpen(true);
  };

  const handleConfirmReturn = () => {
    if (returningId) {
      setRows(
        rows.map((r) =>
          r.id === returningId
            ? {
                ...r,
                returnDate: returnDate,
                status: "returned",
              }
            : r
        )
      );
      setReturnDialogOpen(false);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSaveBorrow = () => {
    const user = mockUsers.find((u) => u.id === formData.userId);
    const book = mockBooks.find((b) => b.id === formData.bookId);

    if (!user || !book) {
      alert("Please select both a user and a book");
      return;
    }

    if (book.availableQuantity <= 0) {
      alert("This book is not available for borrowing");
      return;
    }

    if (editingId) {
      setRows(
        rows.map((r) =>
          r.id === editingId
            ? {
                ...r,
                ...formData,
              }
            : r
        )
      );
    } else {
      const newId = String(Math.max(...rows.map((r) => parseInt(r.id))) + 1);
      setRows([
        ...rows,
        {
          id: newId,
          ...formData,
        },
      ]);
    }
    setOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "borrowed":
        return "info";
      case "returned":
        return "success";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "userId",
      headerName: "User",
      width: 150,
      valueGetter: (value) => {
        const user = mockUsers.find((u) => u.id === value);
        return user?.name || "";
      },
    },
    {
      field: "bookId",
      headerName: "Book",
      width: 250,
      valueGetter: (value) => {
        const book = mockBooks.find((b) => b.id === value);
        return book?.title || "";
      },
    },
    {
      field: "borrowDate",
      headerName: "Borrow Date",
      width: 120,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 120,
    },
    {
      field: "returnDate",
      headerName: "Return Date",
      width: 120,
      renderCell: (params) => params.value || "—",
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      width: 150,
      getActions: (params: GridRowParams) => {
        const record = rows.find((r) => r.id === params.id);
        const actions = [
          <GridActionsCellItem
            icon={<DeleteRoundedIcon />}
            label="Delete"
            onClick={() => handleDeleteRecord(params.id as string)}
          />,
        ];

        if (record?.status === "borrowed") {
          actions.unshift(
            <GridActionsCellItem
              icon={<CheckCircleRoundedIcon />}
              label="Return"
              onClick={() => handleReturnBook(params.id as string)}
            />
          );
        }

        return actions;
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Card>
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>Borrow/Return Books</h2>
          </div>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddBorrow}
          >
            New Borrow Record
          </Button>
        </Box>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            disableSelectionOnClick
          />
        </Box>
      </Card>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>New Borrow Record</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Alert severity="info">
              User must have active membership status to borrow books
            </Alert>
            <TextField
              select
              label="User"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="">Select User</MenuItem>
              {mockUsers
                .filter((u) => u.status === "active")
                .map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              select
              label="Book"
              name="bookId"
              value={formData.bookId}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="">Select Book</MenuItem>
              {mockBooks
                .filter((b) => b.availableQuantity > 0)
                .map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.title} (Available: {book.availableQuantity})
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              label="Borrow Date"
              name="borrowDate"
              type="date"
              value={formData.borrowDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveBorrow}
            variant="contained"
            disabled={!formData.userId || !formData.bookId}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Return Book</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Return Date"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmReturn} variant="contained">
            Confirm Return
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
