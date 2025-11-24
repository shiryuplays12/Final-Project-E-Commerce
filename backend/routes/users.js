const express = require("express")
const User = require("../models/User")

const router = express.Router()

// Get all users (Admin)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ success: false, message: "Failed to fetch users" })
  }
})

// Get user profile
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ success: false, message: "Failed to fetch user" })
  }
})

// Update user profile
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, address, currentPassword, newPassword } = req.body

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    if (newPassword && currentPassword) {
      const isValidPassword = await user.comparePassword(currentPassword)
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: "Current password is incorrect" })
      }
      user.password = newPassword
    }

    user.name = name || user.name
    user.email = email || user.email
    user.phone = phone || user.phone
    user.address = address || user.address

    await user.save()

    res.json({
      success: true,
      message: "Profile updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    })
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ success: false, message: "Failed to update profile" })
  }
})

// Toggle user status (Admin)
router.put("/users/:id/status", async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    user.status = status
    await user.save()

    res.json({ success: true, message: "User status updated" })
  } catch (error) {
    console.error("Error updating user status:", error)
    res.status(500).json({ success: false, message: "Failed to update user status" })
  }
})

// Delete user (Admin)
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    res.json({ success: true, message: "User deleted" })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ success: false, message: "Failed to delete user" })
  }
})

module.exports = router
