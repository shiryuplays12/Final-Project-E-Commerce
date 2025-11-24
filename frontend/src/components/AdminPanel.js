"use client"

import { useState, useEffect } from "react"

const AdminPanel = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState("products")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [orderLoading, setOrderLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageStorage, setImageStorage] = useState({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
  })
  const [editingUser, setEditingUser] = useState(null)

  const formatPrice = (price) => "₱" + price.toLocaleString("en-PH")

  const generateImageFilename = () => {
    return `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
  }

  const openModal = (type, item = null) => {
    setModalType(type)
    setSelectedItem(item)
    setImagePreview(item?.image || null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedItem(null)
    setModalType("")
    setImagePreview(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    const formDataObj = new FormData(e.target)

    let imageFilename = selectedItem?.image || "📱"
    if (imagePreview && typeof imagePreview === "string" && imagePreview.startsWith("data:")) {
      imageFilename = generateImageFilename()
      setImageStorage((prev) => ({
        ...prev,
        [imageFilename]: imagePreview,
      }))
    } else if (typeof imagePreview === "string" && !imagePreview.startsWith("data:")) {
      imageFilename = imagePreview
    }

    const productData = {
      brand: formDataObj.get("brand"),
      name: formDataObj.get("name"),
      price: Number.parseFloat(formDataObj.get("price")),
      stock: Number.parseInt(formDataObj.get("stock")),
      status: formDataObj.get("status"),
      image: imageFilename,
    }

    try {
      if (selectedItem) {
        const response = await fetch(`http://localhost:5000/api/products/${selectedItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
        if (response.ok) {
          setProducts(products.map((p) => (p._id === selectedItem._id ? { ...productData, _id: selectedItem._id } : p)))
        }
      } else {
        const response = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
        const result = await response.json()
        if (result.success) {
          setProducts([...products, { ...productData, _id: result._id }])
        }
      }
      closeModal()
    } catch (error) {
      alert("Failed to save product")
    }
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()
    const formDataObj = new FormData(e.target)
    const userData = {
      name: formDataObj.get("name"),
      email: formDataObj.get("email"),
      phone: formDataObj.get("phone"),
      address: formDataObj.get("address"),
      status: formDataObj.get("status"),
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
      if (response.ok) {
        setUsers(users.map((u) => (u.id === selectedItem.id ? { ...u, ...userData } : u)))
        closeModal()
      }
    } catch (error) {
      alert("Failed to save user")
    }
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setProducts(products.filter((p) => p._id !== id))
        }
      } catch (error) {
        alert("Failed to delete product")
      }
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)))
      }
    } catch (error) {
      alert("Failed to update order status")
    }
  }

  const handleToggleUserStatus = (userId) => {
    if (window.confirm("Are you sure you want to toggle this user's status?")) {
      const user = users.find((u) => u._id === userId)
      if (!user) return

      const newStatus = user.status === "active" ? "banned" : "active"

      fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
        .then((response) => response.json())
        .then(() => {
          setUsers(users.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)))
        })
        .catch(() => alert("Failed to update user status"))
    }
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const userToDelete = users.find((u) => u._id === userId)
      if (!userToDelete) return

      fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then(() => {
          setUsers(users.filter((u) => u._id !== userId))
        })
        .catch(() => alert("Failed to delete user"))
    }
  }

  const fetchAdminProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products")
      const data = await response.json()
      setProducts(data || [])
    } catch (error) {
      setProducts([])
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users")
      const data = await response.json()
      setUsers(data || [])
    } catch (error) {
      setUsers([])
    }
  }

  const fetchOrders = async () => {
    setOrderLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/orders")
      const data = await response.json()
      setOrders(data || [])
    } catch (error) {
      setOrders([])
    } finally {
      setOrderLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminProducts()
    fetchUsers()
    fetchOrders()

    const ordersInterval = setInterval(fetchOrders, 3000)
    return () => clearInterval(ordersInterval)
  }, [])

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          background: "#1e293b",
          color: "white",
          padding: "2rem 0",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
          boxShadow: "4px 0 12px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ padding: "0 1.5rem", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#60a5fa", margin: 0 }}>🚀 NexTech</h2>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.5rem 0 0 0", fontWeight: "600" }}>
            Admin Panel
          </p>
        </div>

        <nav>
          {[
            { id: "products", icon: "📱", label: "Products" },
            { id: "orders", icon: "📦", label: "Orders" },
            { id: "users", icon: "👥", label: "Users" },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                padding: "1rem 1.5rem",
                cursor: "pointer",
                background: currentView === item.id ? "rgba(59, 130, 246, 0.1)" : "transparent",
                borderLeft: currentView === item.id ? "3px solid #60a5fa" : "3px solid transparent",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: currentView === item.id ? "#60a5fa" : "#cbd5e1",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              <span style={{ fontWeight: currentView === item.id ? "600" : "500", fontSize: "0.95rem" }}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>

        <div style={{ padding: "1.5rem 1.5rem", marginTop: "auto", borderTop: "1px solid #334155" }}>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
              border: "none",
              padding: "0.875rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "280px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top Bar */}
        <div
          style={{
            background: "#1e293b",
            borderBottom: "1px solid #334155",
            padding: "1.5rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "white", margin: 0 }}>
            {currentView === "products"
              ? "📱 Product Management"
              : currentView === "orders"
                ? "📦 Order Management"
                : "👥 User Management"}
          </h1>
          {currentView === "products" && (
            <button
              onClick={() => openModal("add")}
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                border: "none",
                padding: "0.875rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.2s",
              }}
            >
              ➕ Add New Product
            </button>
          )}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: "2rem", overflowY: "auto", background: "#0f172a" }}>
         {currentView === "products" && (
  <div
    style={{
      background: "#1e293b",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      overflow: "hidden",
    }}
  >
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#0f172a", borderBottom: "2px solid #334155" }}>
          <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
            Product
          </th>
          <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
            Brand
          </th>
          <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
            Price
          </th>
          <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
            Stock
          </th>
          <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
            Status
          </th>
          <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          // Determine image type
          const isBase64Image = typeof product.image === "string" && product.image.startsWith("data:image")
          const isEmoji = typeof product.image === "string" && !product.image.startsWith("data:") && !product.image.includes("-")
          const isFilename = typeof product.image === "string" && product.image.includes("-")

          return (
            <tr key={product._id} style={{ borderBottom: "1px solid #334155" }}>
              <td style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#0f172a",
                      borderRadius: "6px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {isBase64Image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : isEmoji ? (
                      <span>{product.image}</span>
                    ) : (
                      <span>🖼️</span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", color: "white", maxWidth: "150px", wordBreak: "break-word" }}>
                      {product.name}
                    </div>
                    {isFilename && (
                      <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.25rem", maxWidth: "150px", wordBreak: "break-all" }}>
                        📁 {product.image.substring(0, 20)}...
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td style={{ padding: "1.25rem", color: "#94a3b8" }}>{product.brand}</td>
              <td style={{ padding: "1.25rem", fontWeight: "600", color: "#60a5fa" }}>
                {formatPrice(product.price)}
              </td>
              <td style={{ padding: "1.25rem" }}>
                <span style={{ color: product.stock < 15 ? "#fca5a5" : "#86efac", fontWeight: "600" }}>
                  {product.stock} units
                </span>
              </td>
              <td style={{ padding: "1.25rem" }}>
                <span
                  style={{
                    padding: "0.375rem 0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    background:
                      product.status === "active" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    color: product.status === "active" ? "#86efac" : "#fca5a5",
                  }}
                >
                  {product.status}
                </span>
              </td>
              <td style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => openModal("edit", product)}
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 0.875rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      transition: "all 0.2s",
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 0.875rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      transition: "all 0.2s",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)}

          {currentView === "orders" && (
            <div
              style={{
                background: "#1e293b",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0f172a", borderBottom: "2px solid #334155" }}>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Order ID
                    </th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Customer
                    </th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>Date</th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Items
                    </th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Total
                    </th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Status
                    </th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: "1px solid #334155" }}>
                      <td style={{ padding: "1.25rem", fontWeight: "600", color: "#60a5fa" }}>{order._id}</td>
                      <td style={{ padding: "1.25rem" }}>
                        <div style={{ fontWeight: "600", color: "white" }}>{order.customer}</div>
                        <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{order.email}</div>
                      </td>
                      <td style={{ padding: "1.25rem", color: "#94a3b8" }}>{order.date}</td>
                      <td style={{ padding: "1.25rem", fontSize: "0.9rem" }}>
                        {Array.isArray(order.items) &&
                          order.items.map((item, index) => (
                            <div key={index} style={{ padding: "0.5rem 0", fontSize: "0.95rem", color: "#cbd5e1" }}>
                              {item.name} x {item.quantity}
                            </div>
                          ))}
                      </td>
                      <td style={{ padding: "1.25rem", fontWeight: "600", color: "white" }}>
                        {formatPrice(order.total)}
                      </td>
                      <td style={{ padding: "1.25rem" }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          style={{
                            padding: "0.5rem",
                            borderRadius: "6px",
                            border: "1px solid #334155",
                            fontSize: "0.85rem",
                            background: "#0f172a",
                            color: "#cbd5e1",
                            cursor: "pointer",
                          }}
                        >
                          <option>pending</option>
                          <option>processing</option>
                          <option>shipped</option>
                          <option>delivered</option>
                          <option>cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: "1.25rem" }}>
                        <button
                          onClick={() => {
                            alert(
                              `Order Details:\nID: ${order._id}\nStatus: ${order.status}\nTotal: ${formatPrice(order.total)}\nItems: ${order.items.length}`,
                            )
                          }}
                          style={{
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 0.875rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: "500",
                          }}
                        >
                          👁️ View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentView === "users" && (
            <div
              style={{
                background: "#1e293b",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0f172a", borderBottom: "2px solid #334155" }}>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>Name</th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Email
                    </th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Phone
                    </th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Address
                    </th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Status
                    </th>
                    <th style={{ padding: "1.25rem", textAlign: "left", fontWeight: "600", color: "#cbd5e1" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} style={{ borderBottom: "1px solid #334155" }}>
                      <td style={{ padding: "1.25rem", fontWeight: "600", color: "white" }}>{user.name}</td>
                      <td style={{ padding: "1.25rem", color: "#94a3b8" }}>{user.email}</td>
                      <td style={{ padding: "1.25rem", color: "#94a3b8" }}>{user.phone}</td>
                      <td style={{ padding: "1.25rem", color: "#94a3b8" }}>{user.address}</td>
                      <td style={{ padding: "1.25rem" }}>
                        <span
                          style={{
                            padding: "0.375rem 0.75rem",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            background: user.status === "active" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            color: user.status === "active" ? "#86efac" : "#fca5a5",
                          }}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: "1.25rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            style={{
                              background: "#ef4444",
                              color: "white",
                              border: "none",
                              padding: "0.5rem 0.875rem",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "500",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={closeModal}
          >
            <div
              style={{
                background: "#1e293b",
                borderRadius: "12px",
                padding: "2rem",
                maxWidth: "500px",
                width: "90%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 25px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {modalType === "add" || modalType === "edit" ? (
                <form onSubmit={handleSaveProduct}>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "white", marginBottom: "1.5rem" }}>
                    {modalType === "add" ? "Add New Product" : "Edit Product"}
                  </h2>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", color: "#cbd5e1", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Product Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      defaultValue={selectedItem?.name || ""}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        background: "#0f172a",
                        color: "white",
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", color: "#cbd5e1", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Brand
                    </label>
                    <input
                      name="brand"
                      type="text"
                      defaultValue={selectedItem?.brand || ""}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        background: "#0f172a",
                        color: "white",
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", color: "#cbd5e1", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Price
                    </label>
                    <input
                      name="price"
                      type="number"
                      defaultValue={selectedItem?.price || ""}
                      step="0.01"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        background: "#0f172a",
                        color: "white",
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", color: "#cbd5e1", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Stock
                    </label>
                    <input
                      name="stock"
                      type="number"
                      defaultValue={selectedItem?.stock || ""}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        background: "#0f172a",
                        color: "white",
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", color: "#cbd5e1", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={selectedItem?.status || "active"}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        background: "#0f172a",
                        color: "white",
                      }}
                    >
                      <option>active</option>
                      <option>inactive</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", color: "#cbd5e1", marginBottom: "0.5rem", fontWeight: "600" }}>
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        background: "#0f172a",
                        color: "#cbd5e1",
                      }}
                    />
                    {imagePreview && (
                      <div style={{ marginTop: "1rem" }}>
                        {typeof imagePreview === "string" && imagePreview.startsWith("data:") ? (
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            style={{ maxWidth: "100%", height: "auto", borderRadius: "6px", marginTop: "0.5rem" }}
                          />
                        ) : (
                          <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                            {typeof imagePreview === "string" ? imagePreview : "No preview"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                        color: "white",
                        border: "none",
                        padding: "0.875rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      💾 Save
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      style={{
                        flex: 1,
                        background: "#334155",
                        color: "white",
                        border: "none",
                        padding: "0.875rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      ✖️ Cancel
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
