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
import { Category, mockCategories } from "../data/mockData";

interface FormData {
  id: string;
  name: string;
  description: string;
}

export default function Categories() {
  const [rows, setRows] = React.useState<Category[]>(mockCategories);
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<FormData>({
    id: "",
    name: "",
    description: "",
  });

  const handleAddCategory = () => {
    setEditingId(null);
    setFormData({
      id: "",
      name: "",
      description: "",
    });
    setOpen(true);
  };

  const handleEditCategory = (id: string) => {
    const category = rows.find((c) => c.id === id);
    if (category) {
      setEditingId(id);
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description,
      });
      setOpen(true);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setRows(rows.filter((c) => c.id !== id));
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSaveCategory = () => {
    if (editingId) {
      setRows(
        rows.map((c) =>
          c.id === editingId
            ? {
                ...c,
                ...formData,
              }
            : c
        )
      );
    } else {
      const newId = String(Math.max(...rows.map((c) => parseInt(c.id))) + 1);
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
    { field: "name", headerName: "Category Name", width: 250 },
    { field: "description", headerName: "Description", width: 400 },
    {
      field: "actions",
      type: "actions",
      width: 100,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => handleEditCategory(params.id as string)}
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => handleDeleteCategory(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Card>
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>Categories Management</h2>
          </div>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddCategory}
          >
            Add Category
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
          {editingId ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
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
            onClick={handleSaveCategory}
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
