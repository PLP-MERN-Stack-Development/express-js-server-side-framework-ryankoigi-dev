// auth.js - Authentication middleware checking for API key
const API_KEY = process.env.API_KEY || 'my-secret-key';

module.exports = (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key && key === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid API key' });
  }
};
