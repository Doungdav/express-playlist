const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
const auth = req.header('Authorization');
if (!auth) return res.status(401).json({ error: 'Access denied' });
const token = auth.split(' ')[1];
try {
 const decoded = jwt.verify(token, 'happen');
 req.userId = decoded.userId;
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;