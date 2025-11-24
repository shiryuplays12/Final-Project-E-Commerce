const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nextech-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Sample Data
const products = [
  { brand: 'Apple', name: 'iPhone 15 Pro Max', price: 71940, stock: 45, image: '📱', status: 'active' },
  { brand: 'Samsung', name: 'Galaxy S24 Ultra', price: 77940, stock: 38, image: '📱', status: 'active' },
  { brand: 'Apple', name: 'iPhone 14 Pro', price: 59940, stock: 52, image: '📱', status: 'active' },
  { brand: 'Samsung', name: 'Galaxy Z Fold 5', price: 107940, stock: 12, image: '📱', status: 'active' },
  { brand: 'Realme', name: 'Realme GT 5 Pro', price: 35940, stock: 8, image: '📱', status: 'active' },
];

const orders = [
  { orderId: 'ORD-001', customer: 'Juan Dela Cruz', email: 'juan@email.com', date: '2025-11-15', total: 71940, status: 'Processing', items: 'iPhone 15 Pro Max x1' },
  { orderId: 'ORD-002', customer: 'Maria Santos', email: 'maria@email.com', date: '2025-11-15', total: 155880, status: 'Shipped', items: 'Galaxy S24 Ultra x2' },
  { orderId: 'ORD-003', customer: 'Pedro Reyes', email: 'pedro@email.com', date: '2025-11-14', total: 35940, status: 'Delivered', items: 'Realme GT 5 Pro x1' },
  { orderId: 'ORD-004', customer: 'Ana Garcia', email: 'ana@email.com', date: '2025-11-14', total: 107940, status: 'Processing', items: 'Galaxy Z Fold 5 x1' },
];

const users = [
  { name: 'Juan Dela Cruz', email: 'juan@email.com', phone: '+63 912 345 6789', status: 'active', registered: '2025-01-15', orders: 5 },
  { name: 'Maria Santos', email: 'maria@email.com', phone: '+63 923 456 7890', status: 'active', registered: '2025-02-20', orders: 3 },
  { name: 'Pedro Reyes', email: 'pedro@email.com', phone: '+63 934 567 8901', status: 'active', registered: '2025-03-10', orders: 2 },
  { name: 'Ana Garcia', email: 'ana@email.com', phone: '+63 945 678 9012', status: 'active', registered: '2025-04-05', orders: 4 },
];

// Seed Function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert new data
    await Product.insertMany(products);
    console.log('✅ Products seeded');

    await Order.insertMany(orders);
    console.log('✅ Orders seeded');

    await User.insertMany(users);
    console.log('✅ Users seeded');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();