const validateProduct = (product) => {
    if (!product.name || typeof product.name !== 'string') {
      return 'El nombre del producto es obligatorio y debe ser un texto';
    }
    if (!product.price || typeof product.price !== 'number') {
      return 'El precio del producto es obligatorio y debe ser un número';
    }
    return null; // Si todo está bien
  };
  
  module.exports = { validateProduct };