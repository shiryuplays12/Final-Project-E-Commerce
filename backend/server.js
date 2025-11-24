const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth")
const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders")
const userRoutes = require("./routes/users")

const app = express()
const PORT = process.env.PORT || 5000

connectDB().catch((error) => {
  console.error("Failed to connect to database:", error)
  process.exit(1)
})

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api", authRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)
app.use("/api", userRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
