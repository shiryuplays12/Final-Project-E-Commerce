"use client"

import { useState, useEffect } from "react"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchUsers()
    const interval = setInterval(fetchUsers, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users")
      const data = await response.json()
      setUsers(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      setMessage("Failed to fetch users")
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setMessage("✓ User status updated")
        fetchUsers()
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Failed to update user status")
      }
    } catch (error) {
      console.error("Error updating user status:", error)
      setMessage("Error updating user status")
    }
  }

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setMessage("✓ User deleted successfully")
          fetchUsers()
          setTimeout(() => setMessage(""), 3000)
        } else {
          setMessage("Failed to delete user")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        setMessage("Error deleting user")
      }
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginTop: 0, marginBottom: "2rem", fontSize: "1.8rem", color: "#1f2937" }}>👥 User Management</h2>

      {message && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "1.5rem",
            borderRadius: "8px",
            background: message.includes("✓") ? "#d1fae5" : "#fee2e2",
            color: message.includes("✓") ? "#065f46" : "#991b1b",
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>Loading users...</div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>No users found</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#374151" }}>Name</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#374151" }}>Email</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#374151" }}>Phone</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#374151" }}>Status</th>
                <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "#374151" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "1rem", color: "#1f2937" }}>{user.name}</td>
                  <td style={{ padding: "1rem", color: "#1f2937" }}>{user.email}</td>
                  <td style={{ padding: "1rem", color: "#1f2937" }}>{user.phone}</td>
                  <td style={{ padding: "1rem" }}>
                    <select
                      value={user.status}
                      onChange={(e) => updateUserStatus(user._id, e.target.value)}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "2px solid #e5e7eb",
                        background: user.status === "active" ? "#dbeafe" : "#fee2e2",
                        color: user.status === "active" ? "#0c4a6e" : "#7c2d12",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="banned">Banned</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button
                      onClick={() => deleteUser(user._id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
