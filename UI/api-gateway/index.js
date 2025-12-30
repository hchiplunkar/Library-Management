import "./telemetry.js"; // initialize OpenTelemetry first
import express from "express";
import cors from "cors";
import bookService from "./services/bookservice.js";
import userService from "./services/userservice.js";
import reservationService from "./services/reservationservice.js";

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

// ----------------- User Routes -----------------
app.post("/users", async (req, res) => {
  try {
    const response = await userService.createUser(req.body);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/users/:user_id", async (req, res) => {
  try {
    // include user_id in payload so server can identify record if supported
    const payload = { ...req.body, user_id: parseInt(req.params.user_id) };
    const response = await userService.updateUser(payload);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/users/:user_id", async (req, res) => {
  try {
    const response = await userService.deleteUser({ user_id: parseInt(req.params.user_id) });
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/users/:user_id", async (req, res) => {
  try {
    const response = await userService.getUser({ user_id: parseInt(req.params.user_id) });
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const response = await userService.getAllUsers();
    // response is a protobuf object converted to plain JS: { User: [...] }
    const users = (response && (response.User || response.users || response.usersList)) || [];
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Reservation Routes -----------------
app.post("/reservations", async (req, res) => {
  try {
    const payload = { user_id: parseInt(req.body.user_id), book_id: parseInt(req.body.book_id) };
    const response = await reservationService.reserveBook(payload);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/reservations/:reservation_id/return", async (req, res) => {
  try {
    const payload = { reservation_id: parseInt(req.params.reservation_id) };
    const response = await reservationService.returnBook(payload);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/reservations/:reservation_id", async (req, res) => {
  try {
    const payload = { reservation_id: parseInt(req.params.reservation_id) };
    const response = await reservationService.deleteReservation(payload);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
