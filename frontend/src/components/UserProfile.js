"use client"

import { useState, useEffect } from "react"

export default function UserProfile({ userId, onClose, userName, userEmail }) {
  const [profile, setProfile] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    organization: "",
    location: "",
    profileImage: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [editing, setEditing] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (userId) {
      fetchProfile()
    }
  }, [userId])

 

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`)
      const data = await response.json()
      if (response.ok) {
        setProfile(data)
        if (data.profileImage) {
          setImagePreview(data.profileImage)
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      setMessage("Failed to load profile")
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setProfile((prev) => ({
          ...prev,
          profileImage: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const updateData = {
        name: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        organization: profile.organization,
        location: profile.location,
        profileImage: profile.profileImage,
      }

   const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(updateData),
});



      const data = await response.json()

      if (response.ok) {
        setMessage("✓ Profile updated successfully")
        setEditing(false)
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage("Error updating profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#f9fafb",
        display: "flex",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "white",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            height: "60px",
            background: "white",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            zIndex: 999,
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "#1f2937" }}>Account Settings</h1>
          <button
            onClick={onClose}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Close
          </button>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            padding: "3rem",
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "350px 1fr",
            gap: "3rem",
          }}
        >
          {/* Left Column - Profile Picture */}
          <div
            style={{
              background: "#f3f4f6",
              padding: "2rem",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "fit-content",
            }}
          >
            <h3 style={{ margin: "0 0 1.5rem", fontSize: "1rem", fontWeight: "600", color: "#1f2937" }}>
              Profile Picture
            </h3>
            <div
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                margin: "0 auto 1.5rem",
                overflow: "hidden",
                background: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #d1d5db",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "3rem", color: "#9ca3af" }}>👤</span>
              )}
            </div>
            <p style={{ margin: "0 0 1.5rem", fontSize: "0.85rem", color: "#6b7280", textAlign: "center" }}>
              JPG or PNG no larger than 5 MB
            </p>
            {editing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="profileImageInput"
                />
                <label
                  htmlFor="profileImageInput"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1.5rem",
                    background: "#3b82f6",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    textAlign: "center",
                    border: "none",
                  }}
                >
                  Upload new image
                </label>
              </>
            )}
          </div>

          {/* Right Column - Account Details */}
          <div>
            <h3 style={{ margin: "0 0 1.5rem", fontSize: "1rem", fontWeight: "600", color: "#1f2937" }}>
              Account Details
            </h3>

            {message && (
              <div
                style={{
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  borderRadius: "8px",
                  background: message.includes("✓") ? "#d1fae5" : "#fee2e2",
                  color: message.includes("✓") ? "#065f46" : "#991b1b",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Username Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#1f2937",
                      fontSize: "0.9rem",
                    }}
                  >
                    Username
                  </label>
                  <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", color: "#6b7280" }}>
                    these your name will appear to other users on the site
                  </p>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    disabled={!editing}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      background: editing ? "white" : "#f9fafb",
                      cursor: editing ? "text" : "default",
                      color: "#374151",
                    }}
                  />
                </div>

                {/* First Name and Last Name */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#1f2937",
                        fontSize: "0.9rem",
                      }}
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Valerie"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      disabled={!editing}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                        background: editing ? "white" : "#f9fafb",
                        cursor: editing ? "text" : "default",
                        color: "#374151",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#1f2937",
                        fontSize: "0.9rem",
                      }}
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Luna"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      disabled={!editing}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                        background: editing ? "white" : "#f9fafb",
                        cursor: editing ? "text" : "default",
                        color: "#374151",
                      }}
                    />
                  </div>
                </div>

                {/* Organization and Location */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#1f2937",
                        fontSize: "0.9rem",
                      }}
                    >
                      Organisation name
                    </label>
                    <input
                      type="text"
                      name="organization"
                      placeholder="Start Bootstrap"
                      value={profile.organization}
                      onChange={handleProfileChange}
                      disabled={!editing}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                        background: editing ? "white" : "#f9fafb",
                        cursor: editing ? "text" : "default",
                        color: "#374151",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#1f2937",
                        fontSize: "0.9rem",
                      }}
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="San Francisco, CA"
                      value={profile.location}
                      onChange={handleProfileChange}
                      disabled={!editing}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                        background: editing ? "white" : "#f9fafb",
                        cursor: editing ? "text" : "default",
                        color: "#374151",
                      }}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#1f2937",
                      fontSize: "0.9rem",
                    }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={!editing}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      background: editing ? "white" : "#f9fafb",
                      cursor: editing ? "text" : "default",
                      color: "#374151",
                    }}
                  />
                </div>

                {/* Phone and Birthday */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#1f2937",
                        fontSize: "0.9rem",
                      }}
                    >
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="555-123-4567"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      disabled={!editing}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                        background: editing ? "white" : "#f9fafb",
                        cursor: editing ? "text" : "default",
                        color: "#374151",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#1f2937",
                        fontSize: "0.9rem",
                      }}
                    >
                      Birthday
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleProfileChange}
                      disabled={!editing}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                        background: editing ? "white" : "#f9fafb",
                        cursor: editing ? "text" : "default",
                        color: "#374151",
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  {!editing ? (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      style={{
                        padding: "0.75rem 2rem",
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      Save changes
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          padding: "0.75rem 2rem",
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "600",
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.6 : 1,
                          fontSize: "0.9rem",
                        }}
                      >
                        {loading ? "Saving..." : "Save changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false)
                          fetchProfile()
                        }}
                        style={{
                          padding: "0.75rem 2rem",
                          background: "#e5e7eb",
                          color: "#374151",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

