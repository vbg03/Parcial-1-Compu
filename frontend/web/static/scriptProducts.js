const API_URL = 'http://192.168.100.3:5003/api/products';
const ORDERS_API_URL = 'http://192.168.100.3:5004/api/orders';

function showMessage(type, text) {
    const msg = document.getElementById('message');
    if (msg) {
        msg.className = `alert alert-${type}`;
        msg.textContent = text;
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 3000);
    }
}

function getProducts() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#product-list tbody');
            tbody.innerHTML = '';
            
            // Verificamos en qué página estamos para mostrar la vista correcta
            const isDashboard = window.location.pathname.includes('/dashboard');

            data.forEach(p => {
                const row = document.createElement('tr');
                // Guardamos el ID del producto en el elemento de la fila para usarlo después
                row.dataset.productId = p.id;

                let actionsCell = '';
                if (isDashboard) {
                    // Vista del cliente: campo para la cantidad
                    actionsCell = `
                        <td>
                            <input type="number" class="form-control" min="0" value="0" style="width: 80px;" />
                        </td>`;
                } else {
                    // Vista de admin: botones de Editar/Eliminar
                    actionsCell = `
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="openEditModal(${p.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Delete</button>
                        </td>`;
                }
                
                row.innerHTML = `
                    <td>${p.name}</td>
                    <td>${p.description}</td>
                    <td>${p.price}</td>
                    <td>${p.stock}</td>
                    <td>${p.category}</td>
                    ${actionsCell}
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => console.error('Error loading products:', err));
}

function createProduct() {
    const data = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value) || 0,
        category: document.getElementById('category').value
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
        showMessage('success', 'Product created!');
        getProducts();
        document.getElementById('add-product-form').reset();
    })
    .catch(() => showMessage('danger', 'Error creating product'));
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                showMessage('success', 'Product deleted!');
                getProducts();
            })
            .catch(() => showMessage('danger', 'Error deleting product'));
    }
}

function openEditModal(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(p => {
            document.getElementById('edit-id').value = p.id;
            document.getElementById('edit-name').value = p.name;
            document.getElementById('edit-description').value = p.description;
            document.getElementById('edit-price').value = p.price;
            document.getElementById('edit-stock').value = p.stock;
            document.getElementById('edit-category').value = p.category;
            $('#editModal').modal('show');
        });
}

function updateProduct() {
    const id = document.getElementById('edit-id').value;
    const data = {
        name: document.getElementById('edit-name').value,
        description: document.getElementById('edit-description').value,
        price: parseFloat(document.getElementById('edit-price').value),
        stock: parseInt(document.getElementById('edit-stock').value),
        category: document.getElementById('edit-category').value
    };

    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
        $('#editModal').modal('hide');
        showMessage('success', 'Product updated!');
        getProducts();
    })
    .catch(() => showMessage('danger', 'Error updating product'));
}

function orderProducts() {
  const selectedProducts = [];
  const productRows = document.querySelectorAll('#product-list tbody tr');
  
  productRows.forEach(row => {
    const quantityInput = row.querySelector('input[type="number"]');
    const quantity = parseInt(quantityInput.value, 10);
    
    if (quantity > 0) {
      // Obtenemos el ID que guardamos en el 'dataset' de la fila
      const productId = parseInt(row.dataset.productId, 10);
      selectedProducts.push({ id: productId, quantity: quantity });
    }
  });

  if (selectedProducts.length === 0) {
    alert('Please select at least one product to place an order.');
    return;
  }

  // En una app real, obtendrías estos datos del usuario que ha iniciado sesión.
  const orderData = {
    user: {
      name: "Test User",
      email: "test@example.com"
    },
    products: selectedProducts
  };

  fetch(ORDERS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  .then(response => {
    if (!response.ok) {
        // Si hay un error, intentamos leer el mensaje del backend
        return response.json().then(err => { throw new Error(err.message) });
    }
    return response.json();
  })
  .then(data => {
    alert('Order created successfully!');
    getProducts(); // Actualizamos la lista para ver el nuevo stock
  })
  .catch(error => {
    console.error('Error placing order:', error);
    alert('Error creating the order: ' + error.message);
  });
}