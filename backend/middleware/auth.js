// middleware/auth.js
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user || decoded; 
    next();
  } catch (err) {
    console.error('Token invalid:', err.message);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};