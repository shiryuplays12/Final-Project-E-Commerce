"use client"

import { useState, useEffect } from "react"
import UserStore from "./components/UserStore"
import AdminPanel from "./components/AdminPanel"




import "./App.css"

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem("nextech_admin_token")
    if (adminToken) {
      setIsAdminLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const adminToken = localStorage.getItem("nextech_admin_token")
      setIsAdminLoggedIn(!!adminToken)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleAdminLogout = () => {
    localStorage.removeItem("nextech_admin_token")
    localStorage.removeItem("nextech_user_token")
    localStorage.removeItem("nextech_user")
    setIsAdminLoggedIn(false)
  }

  return (
    <div className="App">
      {isAdminLoggedIn ? (
        <AdminPanel onLogout={handleAdminLogout} />
      ) : (
        <UserStore setIsAdminLoggedIn={setIsAdminLoggedIn} />
      )}
    </div>
  )
}

export default App
