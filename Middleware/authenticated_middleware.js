//authenticated_middleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_JWT_secret_key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'A token is required for authentication',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

module.exports = { authenticateToken };
