const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    customer: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, default: "Processing" },
    paymentMethod: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

const Order = mongoose.model("Order", orderSchema)
module.exports = Order
