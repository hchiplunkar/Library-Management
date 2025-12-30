import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api/userApi";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const data = await getAllUsers();
    setUsers(data.users || []);
  }

  async function handleDelete(id) {
    await deleteUser(id);
    loadUsers();
  }

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(u => (
          <li key={u.user_id}>
            {u.name}
            <button onClick={() => handleDelete(u.user_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
