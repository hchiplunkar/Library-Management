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
    // Validate input at the gateway level
    const userId = parseInt(req.body.user_id);
    const bookId = parseInt(req.body.book_id);
    if (!Number.isInteger(userId) || !Number.isInteger(bookId) || userId <= 0 || bookId <= 0) {
      return res.status(400).json({ error: "user_id and book_id are required and must be positive integers" });
    }

    const payload = { user_id: userId, book_id: bookId };
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

app.get("/reservations", async (req, res) => {
  try {
    const response = await reservationService.getAllReservations();

    // Normalize response: support single protobuf message or a list-like shape
    if (!response) return res.json({ reservations: [] });

    // Prefer the protobuf repeated field name `Reservation` (camel/pascal variations)
    const list = response.Reservation || response.reservation || response.Reservations || response.reservations || null;
    if (Array.isArray(list)) {
      // map protobuf objects to plain shape
      const mapped = list.map(r => ({
        reservation_id: r.reservation_id || r.reservationId || 0,
        user_id: r.user_id || r.userId || 0,
        user_name: r.user_name || r.userName || "",
        book_id: r.book_id || r.bookId || 0,
        book_name: r.book_name || r.bookName || ""
      }));

      // Enrich with user and book names by calling respective services (batch unique IDs)
      // Optimization: only request details for entries missing names (reservation service may already provide them)
      const userIds = [...new Set(mapped.filter(m => !m.user_name).map(m => m.user_id).filter(id => id))];
      const bookIds = [...new Set(mapped.filter(m => !m.book_name).map(m => m.book_id).filter(id => id))];

      try {
        const userPromises = userIds.map(id => userService.getUser({ user_id: id }).then(r => [id, r]).catch(() => [id, null]));
        const bookPromises = bookIds.map(id => bookService.getBook(id).then(r => [id, r]).catch(() => [id, null]));

        const usersRes = await Promise.all(userPromises);
        const booksRes = await Promise.all(bookPromises);

        const usersMap = new Map(usersRes.map(([id, r]) => [id, r]));
        const booksMap = new Map(booksRes.map(([id, r]) => [id, r]));

        // populate names
        for (const m of mapped) {
          const u = usersMap.get(m.user_id);
          if (u) {
            // GetUser returns an object with `name` field
            m.user_name = u.name || m.user_name || "";
          }

          const b = booksMap.get(m.book_id);
          if (b) {
            // GetBook returns { book: { book_name, ... } }
            m.book_name = (b.book && b.book.book_name) || b.book_name || m.book_name || "";
          }
        }
      } catch (e) {
        console.warn("Failed to enrich reservations with names:", e.message || e);
      }

      return res.json({ reservations: mapped });
    }

    // fallback: no reservations
    res.json({ reservations: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
