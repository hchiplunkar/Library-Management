import { useEffect, useState } from "react";
import { addBook, getAllCategories } from "../api/bookApi";

export default function BookForm({ onSuccess, initialData }) {
  const [form, setForm] = useState({
    book_name: "",
    category_id: "",
    author_id: "",
    publisher_id: ""
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories().then(res => setCategories(res.category || []));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        book_name: initialData.book_name || "",
        category_id: initialData.category_id || "",
        author_id: initialData.author_id || "",
        publisher_id: initialData.publisher_id || ""
      });
    }
  }, [initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      category_id: Number(form.category_id),
      author_id: Number(form.author_id),
      publisher_id: Number(form.publisher_id)
    };
    if (initialData) {
      await updateBook(initialData.book_id, payload);
    } else {
      await addBook(payload);
    }
    onSuccess && onSuccess();
    setForm({ book_name: "", category_id: "", author_id: "", publisher_id: "" });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialData ? "Edit Book" : "Add Book"}</h3>
      <input name="book_name" placeholder="Book Name" onChange={handleChange} />
      <select name="category_id" onChange={handleChange}>
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c.category_id} value={c.category_id}>
            {c.category_name}
          </option>
        ))}
      </select>
      <input name="author_id" placeholder="Author ID" onChange={handleChange} />
      <input name="publisher_id" placeholder="Publisher ID" onChange={handleChange} />
      <button type="submit">Save</button>
    </form>
  );
}
