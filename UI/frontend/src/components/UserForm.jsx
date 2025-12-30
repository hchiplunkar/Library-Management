import { useEffect, useState } from "react";
import { addUser, updateUser } from "../api/userApi";

export default function UserForm({ onSuccess, initialData }) {
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (initialData) setForm({ name: initialData.name || "", email: initialData.email || "" });
  }, [initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (initialData) {
      await updateUser(initialData.user_id, form);
    } else {
      await addUser(form);
    }
    onSuccess && onSuccess();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>{initialData ? "Edit User" : "Add User"}</h4>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <button type="submit">Save</button>
    </form>
  );
}
