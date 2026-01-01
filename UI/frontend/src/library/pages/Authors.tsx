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
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Author, mockAuthors } from "../data/mockData";

interface FormData {
  id: string;
  name: string;
  biography: string;
  dateOfBirth: string;
}

export default function Authors() {
  const [rows, setRows] = React.useState<Author[]>(mockAuthors);
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<FormData>({
    id: "",
    name: "",
    biography: "",
    dateOfBirth: "",
  });

  const handleAddAuthor = () => {
    setEditingId(null);
    setFormData({
      id: "",
      name: "",
      biography: "",
      dateOfBirth: "",
    });
    setOpen(true);
  };

  const handleEditAuthor = (id: string) => {
    const author = rows.find((a) => a.id === id);
    if (author) {
      setEditingId(id);
      setFormData({
        id: author.id,
        name: author.name,
        biography: author.biography,
        dateOfBirth: author.dateOfBirth,
      });
      setOpen(true);
    }
  };

  const handleDeleteAuthor = (id: string) => {
    setRows(rows.filter((a) => a.id !== id));
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSaveAuthor = () => {
    if (editingId) {
      setRows(
        rows.map((a) =>
          a.id === editingId
            ? {
                ...a,
                ...formData,
              }
            : a
        )
      );
    } else {
      const newId = String(Math.max(...rows.map((a) => parseInt(a.id))) + 1);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Author Name", width: 200 },
    { field: "biography", headerName: "Biography", width: 350 },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      width: 150,
    },
    {
      field: "actions",
      type: "actions",
      width: 100,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => handleEditAuthor(params.id as string)}
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => handleDeleteAuthor(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Card>
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>Authors Management</h2>
          </div>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddAuthor}
          >
            Add Author
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
          {editingId ? "Edit Author" : "Add New Author"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Author Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Biography"
              name="biography"
              value={formData.biography}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveAuthor}
            variant="contained"
            disabled={!formData.name}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
