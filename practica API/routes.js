const { validateProduct } = require('./validations');
const { logEvent } = require('./logger');

const data = [
  { id: 1, name: 'Producto 1', price: 100 },
  { id: 2, name: 'Producto 2', price: 200 },
];

const routes = {
  GET: {
    '/': (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Bienvenido a mi API</h1>');
    },
    '/products': (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    },
  },
  POST: {
    '/products': (req, res) => {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const newProduct = JSON.parse(body);
          const validationError = validateProduct(newProduct);
          if (validationError) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: validationError }));
            return;
          }
          newProduct.id = data.length + 1;
          data.push(newProduct);
          logEvent(`Producto creado: ${newProduct.name}`);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newProduct));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
      });
    },
  },
};

module.exports = routes;