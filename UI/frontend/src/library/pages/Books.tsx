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
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  Book,
  mockBooks,
  mockAuthors,
  mockCategories,
  mockPublishers,
} from "../data/mockData";

interface FormData {
  id: string;
  title: string;
  isbn: string;
  authorId: string;
  categoryId: string;
  publisherId: string;
  publicationDate: string;
  quantity: number;
  availableQuantity: number;
  description: string;
}

export default function Books() {
  const [rows, setRows] = React.useState<Book[]>(mockBooks);
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<FormData>({
    id: "",
    title: "",
    isbn: "",
    authorId: "",
    categoryId: "",
    publisherId: "",
    publicationDate: "",
    quantity: 0,
    availableQuantity: 0,
    description: "",
  });

  const handleAddBook = () => {
    setEditingId(null);
    setFormData({
      id: "",
      title: "",
      isbn: "",
      authorId: "",
      categoryId: "",
      publisherId: "",
      publicationDate: "",
      quantity: 0,
      availableQuantity: 0,
      description: "",
    });
    setOpen(true);
  };

  const handleEditBook = (id: string) => {
    const book = rows.find((b) => b.id === id);
    if (book) {
      setEditingId(id);
      setFormData({
        id: book.id,
        title: book.title,
        isbn: book.isbn,
        authorId: book.author.id,
        categoryId: book.category.id,
        publisherId: book.publisher.id,
        publicationDate: book.publicationDate,
        quantity: book.quantity,
        availableQuantity: book.availableQuantity,
        description: book.description,
      });
      setOpen(true);
    }
  };

  const handleDeleteBook = (id: string) => {
    setRows(rows.filter((b) => b.id !== id));
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSaveBook = () => {
    const author = mockAuthors.find((a) => a.id === formData.authorId);
    const category = mockCategories.find((c) => c.id === formData.categoryId);
    const publisher = mockPublishers.find((p) => p.id === formData.publisherId);

    if (!author || !category || !publisher) return;

    if (editingId) {
      setRows(
        rows.map((b) =>
          b.id === editingId
            ? {
                ...b,
                title: formData.title,
                isbn: formData.isbn,
                author,
                category,
                publisher,
                publicationDate: formData.publicationDate,
                quantity: formData.quantity,
                availableQuantity: formData.availableQuantity,
                description: formData.description,
              }
            : b
        )
      );
    } else {
      const newId = String(Math.max(...rows.map((b) => parseInt(b.id))) + 1);
      setRows([
        ...rows,
        {
          id: newId,
          title: formData.title,
          isbn: formData.isbn,
          author,
          category,
          publisher,
          publicationDate: formData.publicationDate,
          quantity: formData.quantity,
          availableQuantity: formData.availableQuantity,
          description: formData.description,
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
      [name]:
        name === "quantity" || name === "availableQuantity"
          ? parseInt(value)
          : value,
    }));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 250 },
    { field: "isbn", headerName: "ISBN", width: 150 },
    {
      field: "author",
      headerName: "Author",
      width: 150,
      valueGetter: (value) => value?.name || "",
    },
    {
      field: "category",
      headerName: "Category",
      width: 130,
      valueGetter: (value) => value?.name || "",
    },
    {
      field: "publisher",
      headerName: "Publisher",
      width: 150,
      valueGetter: (value) => value?.name || "",
    },
    {
      field: "quantity",
      headerName: "Total",
      width: 80,
      type: "number",
    },
    {
      field: "availableQuantity",
      headerName: "Available",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value > 0 ? "success" : "error"}
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
          onClick={() => handleEditBook(params.id as string)}
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => handleDeleteBook(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Card>
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>Books Management</h2>
          </div>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddBook}
          >
            Add Book
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
          {editingId ? "Edit Book" : "Add New Book"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              select
              label="Author"
              name="authorId"
              value={formData.authorId}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="">Select Author</MenuItem>
              {mockAuthors.map((author) => (
                <MenuItem key={author.id} value={author.id}>
                  {author.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="">Select Category</MenuItem>
              {mockCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Publisher"
              name="publisherId"
              value={formData.publisherId}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="">Select Publisher</MenuItem>
              {mockPublishers.map((publisher) => (
                <MenuItem key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Publication Date"
              name="publicationDate"
              type="date"
              value={formData.publicationDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Available Quantity"
              name="availableQuantity"
              type="number"
              value={formData.availableQuantity}
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
            onClick={handleSaveBook}
            variant="contained"
            disabled={!formData.title || !formData.authorId}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
