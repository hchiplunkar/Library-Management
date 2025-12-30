import "./telemetry.js"; // initialize OpenTelemetry first
import express from "express";
import cors from "cors";
import bookService from "./services/bookservice.js";

const app = express();
app.use(cors());
app.use(express.json());

// ----------------- Book Routes -----------------
app.post("/books", async (req, res) => {
  try {
    console.log("Received request to add book:", req.body);
    const response = await bookService.addBook(req.body);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/books/:book_id", async (req, res) => {
  try {
    const payload = { ...req.body, book_id: parseInt(req.params.book_id) };
    const response = await bookService.updateBook(payload);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/books/:book_id", async (req, res) => {
  try {
    const response = await bookService.deleteBook({ book_id: parseInt(req.params.book_id) });
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/books", async (req, res) => 
{
  try 
  {
    const response = await bookService.getAllBooks();
    res.json(response);
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
});

app.get("/books/:book_id", async (req, res) => {
  try {
    const response = await bookService.getBook(parseInt(req.params.book_id));
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Category Routes -----------------
app.post("/categories", async (req, res) => {
  try {
    const response = await bookService.addCategory(req.body);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/categories/:category_id", async (req, res) => 
{
  try {
    const payload = { ...req.body, category_id: parseInt(req.params.category_id) };
    const response = await bookService.updateCategory(payload);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/categories/:category_id", async (req, res) => {
  try {
    const response = await bookService.deleteCategory({ category_id: parseInt(req.params.category_id) });
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const response = await bookService.getAllCategories();
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/categories/:category_id", async (req, res) => {
  try {
    const response = await bookService.getCategory(parseInt(req.params.category_id));
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
