// Función para cargar y mostrar la lista de productos
const loadProducts = async () => {
  const response = await fetch('/api/products');
  const products = await response.json();
  const productList = document.getElementById('productList');
  productList.innerHTML = products.map(product => `
    <div class="product-item" data-id="${product.id}">
      <span><strong>${product.name}</strong> - $${product.price}</span>
      <div>
        <button onclick="editProduct(${product.id})">Editar</button>
        <button onclick="deleteProduct(${product.id})">Eliminar</button>
      </div>
    </div>
  `).join('');
};

// Función para agregar un producto
const addProduct = async (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const price = parseFloat(document.getElementById('price').value);

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'mi-token-secreto',
    },
    body: JSON.stringify({ name, price }),
  });

  if (response.ok) {
    alert('Producto agregado correctamente');
    loadProducts(); // Recargar la lista de productos
  } else {
    const error = await response.json();
    alert(`Error: ${error.error}`);
  }
};

// Función para editar un producto
const editProduct = async (id) => {
  const newName = prompt('Ingrese el nuevo nombre:');
  const newPrice = parseFloat(prompt('Ingrese el nuevo precio:'));

  if (newName && !isNaN(newPrice)) {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'mi-token-secreto',
      },
      body: JSON.stringify({ name: newName, price: newPrice }),
    });

    if (response.ok) {
      alert('Producto actualizado correctamente');
      loadProducts(); // Recargar la lista de productos
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  } else {
    alert('Datos inválidos');
  }
};

// Función para eliminar un producto
const deleteProduct = async (id) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'mi-token-secreto',
      },
    });

    if (response.ok) {
      alert('Producto eliminado correctamente');
      loadProducts(); // Recargar la lista de productos
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  }
};

// Cargar productos al iniciar
loadProducts();

// Escuchar el envío del formulario
document.getElementById('addProductForm').addEventListener('submit', addProduct);