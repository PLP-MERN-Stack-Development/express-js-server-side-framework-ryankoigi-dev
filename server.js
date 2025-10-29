// server.js - Express.js RESTful API Assignment
// ---------------------------------------------
// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'my-secret-key';

// Middleware: JSON body parser
app.use(bodyParser.json());

// ------------------------------
// Custom Middleware
// ------------------------------

// Logger middleware (Task 3)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Authentication middleware (Task 3)
const authenticate = (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key && key === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid API key' });
  }
};

// Validation middleware (Task 3)
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || price == null || !category || inStock == null) {
    return res.status(400).json({ error: 'Validation Error: Missing required fields' });
  }
  if (typeof price !== 'number' || typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'Validation Error: Invalid data types' });
  }
  next();
};

// ------------------------------
// In-memory Product Data
// ------------------------------
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true,
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true,
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false,
  },
];

// ------------------------------
// Routes
// ------------------------------

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// 🟢 GET /api/products - List all products (with filtering, pagination, and search)
app.get('/api/products', (req, res) => {
  let results = [...products];
  const { category, search, page = 1, limit = 5 } = req.query;

  // Filtering
  if (category) {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  // Search
  if (search) {
    results = results.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  // Pagination
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginatedResults = results.slice(start, end);

  res.json({
    total: results.length,
    page: parseInt(page),
    limit: parseInt(limit),
    data: paginatedResults,
  });
});

// 🟢 GET /api/products/:id - Get specific product by ID
app.get('/api/products/:id', (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    const err = new NotFoundError('Product not found');
    return next(err);
  }
  res.json(product);
});

// 🟢 POST /api/products - Create a new product
app.post('/api/products', authenticate, validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 🟢 PUT /api/products/:id - Update an existing product
app.put('/api/products/:id', authenticate, validateProduct, (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    const err = new NotFoundError('Product not found');
    return next(err);
  }
  products[index] = { id: req.params.id, ...req.body };
  res.json(products[index]);
});

// 🟢 DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authenticate, (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    const err = new NotFoundError('Product not found');
    return next(err);
  }
  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted successfully', deleted });
});

// 🟢 GET /api/products/stats - Product statistics (count by category)
app.get('/api/products/stats', (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  res.json({ totalProducts: products.length, countByCategory: stats });
});

// ------------------------------
// Error Handling (Task 4)
// ------------------------------
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong',
  });
});

// ------------------------------
// Start Server
// ------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

module.exports = app;
