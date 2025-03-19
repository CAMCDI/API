const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { PORT, SECRET_TOKEN } = require('./config');
const { logEvent } = require('./logger');
const { validateProduct } = require('./validations');

// Datos de ejemplo (simulando una base de datos)
let data = [
  { id: 1, name: 'Producto 1', price: 100 },
  { id: 2, name: 'Producto 2', price: 200 },
];

// Middleware de autenticación
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token || token !== SECRET_TOKEN) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Acceso denegado, token inválido' }));
  }
  next();
};

// Función para manejar errores
const handleError = (res, statusCode, message) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
};

// Función para enviar respuestas exitosas
const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// Función para servir archivos estáticos (HTML, CSS, JS)
const serveStaticFile = (res, filePath, contentType) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      handleError(res, 500, 'Error al cargar el archivo');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
};

// Creamos el servidor HTTP
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  const query = parsedUrl.query;

  logEvent(`Solicitud: ${method} ${path}`);

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Servir la interfaz web
  if (path === '/' && method === 'GET') {
    serveStaticFile(res, './public/index.html', 'text/html');
    return;
  }

  // Servir archivos estáticos (CSS, JS)
  if (path.startsWith('/static/') && method === 'GET') {
    const filePath = `./public${path}`;
    const extname = String(path.split('.').pop()).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
    };
    const contentType = mimeTypes[`.${extname}`] || 'application/octet-stream';
    serveStaticFile(res, filePath, contentType);
    return;
  }

  // Endpoints de la API
  if (path === '/api/products' && method === 'GET') {
    sendResponse(res, 200, data);
    return;
  }

  if (path === '/api/products' && method === 'POST') {
    authenticate(req, res, () => {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const newProduct = JSON.parse(body);
          const validationError = validateProduct(newProduct);
          if (validationError) {
            handleError(res, 400, validationError);
            return;
          }
          newProduct.id = data.length + 1;
          data.push(newProduct);
          logEvent(`Producto creado: ${newProduct.name}`);
          sendResponse(res, 201, newProduct);
        } catch (error) {
          handleError(res, 400, 'Datos inválidos');
        }
      });
    });
    return;
  }

  if (path.startsWith('/api/products/') && method === 'PUT') {
    authenticate(req, res, () => {
      const id = parseInt(path.split('/')[3]);
      const productIndex = data.findIndex(p => p.id === id);
      if (productIndex === -1) {
        handleError(res, 404, 'Producto no encontrado');
        return;
      }

      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const updatedProduct = JSON.parse(body);
          const validationError = validateProduct(updatedProduct);
          if (validationError) {
            handleError(res, 400, validationError);
            return;
          }
          data[productIndex] = { ...data[productIndex], ...updatedProduct };
          logEvent(`Producto actualizado: ${data[productIndex].name}`);
          sendResponse(res, 200, data[productIndex]);
        } catch (error) {
          handleError(res, 400, 'Datos inválidos');
        }
      });
    });
    return;
  }

  if (path.startsWith('/api/products/') && method === 'DELETE') {
    authenticate(req, res, () => {
      const id = parseInt(path.split('/')[3]);
      const productIndex = data.findIndex(p => p.id === id);
      if (productIndex === -1) {
        handleError(res, 404, 'Producto no encontrado');
        return;
      }
      const deletedProduct = data.splice(productIndex, 1)[0];
      logEvent(`Producto eliminado: ${deletedProduct.name}`);
      sendResponse(res, 200, { message: 'Producto eliminado', deletedProduct });
    });
    return;
  }

  // Ruta no encontrada
  handleError(res, 404, 'Ruta no encontrada');
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});