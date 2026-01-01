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
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { User, mockUsers } from "../data/mockData";

interface FormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipDate: string;
  status: "active" | "inactive";
}

export default function Users() {
  const [rows, setRows] = React.useState<User[]>(mockUsers);
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<FormData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    membershipDate: "",
    status: "active",
  });

  const handleAddUser = () => {
    setEditingId(null);
    setFormData({
      id: "",
      name: "",
      email: "",
      phone: "",
      membershipDate: "",
      status: "active",
    });
    setOpen(true);
  };

  const handleEditUser = (id: string) => {
    const user = rows.find((u) => u.id === id);
    if (user) {
      setEditingId(id);
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        membershipDate: user.membershipDate,
        status: user.status,
      });
      setOpen(true);
    }
  };

  const handleDeleteUser = (id: string) => {
    setRows(rows.filter((u) => u.id !== id));
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSaveUser = () => {
    if (editingId) {
      setRows(
        rows.map((u) =>
          u.id === editingId
            ? {
                ...u,
                ...formData,
              }
            : u
        )
      );
    } else {
      const newId = String(Math.max(...rows.map((u) => parseInt(u.id))) + 1);
      setRows([
        ...rows,
        {
          ...formData,
          id: newId,
          borrowedBooks: [],
        },
      ]);
    }
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "membershipDate",
      headerName: "Membership Date",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "active" ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "borrowedBooks",
      headerName: "Books Borrowed",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value.length}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      width: 100,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => handleEditUser(params.id as string)}
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => handleDeleteUser(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Card>
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>Users Management</h2>
          </div>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddUser}
          >
            Add User
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
        <DialogTitle>
          {editingId ? "Edit User" : "Add New User"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Membership Date"
              name="membershipDate"
              type="date"
              value={formData.membershipDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              SelectProps={{
                native: true,
              }}
              fullWidth
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            disabled={!formData.name || !formData.email}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
