import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api/userApi";

export default function UserList({ refresh = 0, onEdit }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, [refresh]);

  async function loadUsers() {
    const data = await getAllUsers();
    // support responses like { users: [...] } or an array directly
    if (Array.isArray(data)) setUsers(data);
    else if (data && Array.isArray(data.users)) setUsers(data.users);
    else setUsers([]);
  }

  async function handleDelete(id) {
    await deleteUser(id);
    loadUsers();
  }

  return (
    <div>
      <h3>Users</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user_id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => onEdit && onEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.user_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
