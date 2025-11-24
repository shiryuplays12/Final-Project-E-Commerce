const express = require("express")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const User = require("../models/User")
const authenticateToken = require("../middleware/auth")

const router = express.Router()

// Register User
router.post("/users/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" })
    }

    const userId = uuidv4()
    const user = new User({
      _id: userId,
      name,
      email,
      password,
      phone,
      address: address || "",
    })

    await user.save()

    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "30d",
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { _id: userId, name, email, phone, address },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ success: false, message: "Registration failed" })
  }
})

// Login User
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "30d",
    })

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ success: false, message: "Login failed" })
  }
})

router.get("/users/profile/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address },
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    res.status(500).json({ success: false, message: "Failed to fetch profile" })
  }
})

router.put("/users/profile/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params
    const { name, email, phone, address } = req.body

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, address },
      { new: true, runValidators: true },
    )

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.json({
      success: true,
      message: "Profile updated",
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address },
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({ success: false, message: "Failed to update profile" })
  }
})

module.exports = router
