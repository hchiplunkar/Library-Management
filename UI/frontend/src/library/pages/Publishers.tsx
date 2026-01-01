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
import { Publisher, mockPublishers } from "../data/mockData";

interface FormData {
  id: string;
  name: string;
  country: string;
  website: string;
}

export default function Publishers() {
  const [rows, setRows] = React.useState<Publisher[]>(mockPublishers);
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<FormData>({
    id: "",
    name: "",
    country: "",
    website: "",
  });

  const handleAddPublisher = () => {
    setEditingId(null);
    setFormData({
      id: "",
      name: "",
      country: "",
      website: "",
    });
    setOpen(true);
  };

  const handleEditPublisher = (id: string) => {
    const publisher = rows.find((p) => p.id === id);
    if (publisher) {
      setEditingId(id);
      setFormData({
        id: publisher.id,
        name: publisher.name,
        country: publisher.country,
        website: publisher.website,
      });
      setOpen(true);
    }
  };

  const handleDeletePublisher = (id: string) => {
    setRows(rows.filter((p) => p.id !== id));
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSavePublisher = () => {
    if (editingId) {
      setRows(
        rows.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...formData,
              }
            : p
        )
      );
    } else {
      const newId = String(Math.max(...rows.map((p) => parseInt(p.id))) + 1);
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
    { field: "name", headerName: "Publisher Name", width: 250 },
    { field: "country", headerName: "Country", width: 200 },
    { field: "website", headerName: "Website", width: 250 },
    {
      field: "actions",
      type: "actions",
      width: 100,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => handleEditPublisher(params.id as string)}
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => handleDeletePublisher(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Card>
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>Publishers Management</h2>
          </div>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddPublisher}
          >
            Add Publisher
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
          {editingId ? "Edit Publisher" : "Add New Publisher"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Publisher Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSavePublisher}
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
