import { Routes, Route, Link } from "react-router-dom";
import BooksPage from "./pages/BooksPage";
import UsersPage from "./pages/UsersPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <>
      <nav>
        <Link to="/dashboard">Dashboard</Link> | {" "}
        <Link to="/books">Books</Link> | {" "}
        <Link to="/users">Users</Link>
      </nav>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </>
  );
}
