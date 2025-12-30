import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BooksPage from "./pages/BooksPage";
import UsersPage from "./pages/UsersPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/books">Books</Link> |{" "}
        <Link to="/users">Users</Link>
      </nav>
      <Routes>
        <Route path="/books" element={<BooksPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </BrowserRouter>
  );
}
