const { SECRET_TOKEN } = require('./config');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Acceso denegado, token no proporcionado' }));
  }
  if (token !== SECRET_TOKEN) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Acceso denegado, token inválido' }));
  }
  next(); // Si el token es válido, continúa
};

module.exports = { authenticate };