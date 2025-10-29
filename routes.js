const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory products data
let products = require('../data/products');

// Middleware imports
const authenticate = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');

// Error classes
const NotFoundError = require('../errors/NotFoundError');

// ------------------------------
// Product Routes
// ------------------------------

// GET /api/products → List all products (filter, search, pagination)
router.get('/', (req, res) => {
  let results = [...products];
  const { category, search, page = 1, limit = 5 } = req.query;

  if (category) {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    results = results.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginated = results.slice(start, end);

  res.json({
    total: results.length,
    page: parseInt(page),
    limit: parseInt(limit),
    data: paginated,
  });
});

// GET /api/products/:id → Get product by ID
router.get('/:id', (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
});

// POST /api/products → Create product (requires auth)
router.post('/', authenticate, validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = { id: uuidv4(), name, description, price, category, inStock };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id → Update product (requires auth)
router.put('/:id', authenticate, validateProduct, (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  products[index] = { id: req.params.id, ...req.body };
  res.json(products[index]);
});

// DELETE /api/products/:id → Delete product (requires auth)
router.delete('/:id', authenticate, (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted successfully', deleted });
});

// GET /api/products/stats → Count by category
router.get('/stats/count', (req, res) => {
  const stats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  res.json({ totalProducts: products.length, countByCategory: stats });
});

module.exports = router;
