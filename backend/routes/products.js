const express = require("express")
const { v4: uuidv4 } = require("uuid")
const Product = require("../models/Product")

const router = express.Router()

// Get all active products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({ status: "active" })
    res.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ success: false, message: "Failed to fetch products" })
  }
})

// Get product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ success: false, message: "Failed to fetch product" })
  }
})

// Create product (Admin only)
router.post("/products", async (req, res) => {
  try {
    const { brand, name, price, stock, image, status } = req.body
    const productId = uuidv4()

    const product = new Product({
      _id: productId,
      brand,
      name,
      price,
      stock,
      image: image || "📱",
      status: status || "active",
    })

    await product.save()
    res.status(201).json({ success: true, message: "Product created", _id: productId })
  } catch (error) {
    console.error("Error creating product:", error)
    res.status(500).json({ success: false, message: "Failed to create product" })
  }
})

// Update product
router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { brand, name, price, stock, status } = req.body

    await Product.findByIdAndUpdate(id, { brand, name, price, stock, status }, { new: true })

    res.json({ success: true, message: "Product updated" })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ success: false, message: "Failed to update product" })
  }
})

// Delete product
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    res.json({ success: true, message: "Product deleted" })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ success: false, message: "Failed to delete product" })
  }
})

module.exports = router
