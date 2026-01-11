const API_URL = "http://localhost:3007/api";
const token = localStorage.getItem("token");

// GUARD
if (!token || localStorage.getItem("role") !== "admin") {
  alert("Access denied");
  window.location.href = "login.html";
}

// LOAD (READ)
function loadProducts() {
  fetch(`${API_URL}/admin/api-products`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    products.innerHTML = "";
    data.forEach(p => {
      products.innerHTML += `
        <li>
          <b>${p.name}</b> - ${p.price}
          <button onclick="editProduct(${p.id}, '${p.name}', '${p.description}', ${p.price})">Edit</button>
          <button onclick="deleteProduct(${p.id})">Delete</button>
        </li>
      `;
    });
  });
}

// CREATE / UPDATE
function submitProduct() {
  const id = productId.value;
  const method = id ? "PUT" : "POST";
  const url = id
    ? `${API_URL}/admin/api-products/${id}`
    : `${API_URL}/admin/api-products`;

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      name: name.value,
      description: desc.value,
      price: price.value
    })
  })
  .then(() => {
    productId.value = "";
    name.value = "";
    desc.value = "";
    price.value = "";
    submitBtn.innerText = "Add Product";
    loadProducts();
  });
}

// LOAD DATA KE FORM (UPDATE)
function editProduct(id, nameVal, descVal, priceVal) {
  productId.value = id;
  name.value = nameVal;
  desc.value = descVal;
  price.value = priceVal;
  submitBtn.innerText = "Update Product";
}

// DELETE
function deleteProduct(id) {
  fetch(`${API_URL}/admin/api-products/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }).then(loadProducts);
}

loadProducts();
