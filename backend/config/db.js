const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb+srv://username:password@cluster.mongodb.net/nextech_store"

    await mongoose.connect(mongoURI, {
      retryWrites: true,
      w: "majority",
    })

    console.log("MongoDB Atlas connected successfully")
    return mongoose.connection
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

module.exports = connectDB
