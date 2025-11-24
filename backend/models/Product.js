const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    brand: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, default: "📱" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true },
)

const Product = mongoose.model("Product", productSchema)
module.exports = Product
