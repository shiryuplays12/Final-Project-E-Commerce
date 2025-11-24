const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple admin login (in production, use proper authentication)
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    // Simple password check (in production, use database with hashed passwords)
    if (password === 'admin123') {
      const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify admin token (middleware for protected routes)
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ valid: false });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ valid: true, role: decoded.role });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;