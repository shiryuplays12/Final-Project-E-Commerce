const express = require("express")
const { v4: uuidv4 } = require("uuid")
const Order = require("../models/Order")
const authenticateToken = require("../middleware/auth")

const router = express.Router()

// Create order
router.post("/orders", authenticateToken, async (req, res) => {
  try {
    const { orderId, customer, email, phone, address, items, total, status, paymentMethod, userId, date } = req.body

    if (!orderId || !customer || !email || !phone || !address || !items || !total) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }

    const orderUUID = uuidv4()

    const order = new Order({
      _id: orderUUID,
      orderId,
      userId,
      customer,
      email,
      phone,
      address,
      items,
      total,
      status: status || "Processing",
      paymentMethod,
      date,
    })

    await order.save()
    res.status(201).json({ success: true, message: "Order created", orderId })
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ success: false, message: "Failed to create order", error: error.message })
  }
})

// Get user orders
router.get("/orders/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const orders = await Order.find({ userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ success: false, message: "Failed to fetch orders" })
  }
})

// Get all orders (Admin)
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ success: false, message: "Failed to fetch orders" })
  }
})

// Update order status
router.put("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Update order with new status
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true })

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    res.json({ success: true, message: "Order updated", order: updatedOrder })
  } catch (error) {
    console.error("Error updating order:", error)
    res.status(500).json({ success: false, message: "Failed to update order" })
  }
})

module.exports = router
