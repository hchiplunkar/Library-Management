import { useEffect, useState } from "react";
import { getAllBooks, deleteBook } from "../api/bookApi";

export default function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    const data = await getAllBooks();
    setBooks(data.book || []);
  }

  async function handleDelete(book_id) {
    await deleteBook(book_id);
    loadBooks();
  }

  return (
    <div>
      <h2>Books</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Authors</th>
            <th>Publishers</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.book_id}>
              <td>{b.book_name}</td>
              <td>{b.category_name}</td>
              <td>{b.author_name?.join(", ")}</td>
              <td>{b.publisher_name?.join(", ")}</td>
              <td>
                <button onClick={() => handleDelete(b.book_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
