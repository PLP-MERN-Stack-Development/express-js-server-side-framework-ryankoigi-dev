// validateProduct.js - Validation middleware for product creation and update
module.exports = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price == null || !category || inStock == null) {
    return res.status(400).json({ error: 'Validation Error: Missing required fields' });
  }

  if (typeof price !== 'number' || typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'Validation Error: Invalid data types' });
  }

  next();
};
