import { useEffect, useState } from "react";
import { addBook, getAllCategories } from "../api/bookApi";

export default function BookForm({ onSuccess }) {
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await addBook({
      ...form,
      category_id: Number(form.category_id),
      author_id: Number(form.author_id),
      publisher_id: Number(form.publisher_id)
    });
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Book</h3>
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
