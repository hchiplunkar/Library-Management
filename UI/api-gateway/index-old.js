import "./telemetry.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * BFF endpoint – React-specific aggregation
 * (Replace mock with real gRPC calls)
 */
app.post("/bff/dashboard", async (req, res) => {
  console.log("api-gateway: /bff/dashboard called");
  res.json({
    user: { user_id: 1, name: "Hemant" },
    book: { book_id: 101, book_name: "Distributed Systems" }
  });
});

app.listen(8080, () => {
  console.log("API Gateway running on port 8080");
});
