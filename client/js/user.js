const API_URL = "http://localhost:3007/api";
const token = localStorage.getItem("token");

fetch(`${API_URL}/customer/api-products`, {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
  data.forEach(p => {
    productSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });
});

function generateKey() {
  fetch(`${API_URL}/customer/api-keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      api_product_id: productSelect.value
    })
  })
  .then(res => res.json())
  .then(data => alert("API Key: " + data.apiKey));
}

function loadKeys() {
  fetch(`${API_URL}/customer/api-keys`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    keys.innerHTML = "";
    data.forEach(k => {
      keys.innerHTML += `<li>${k.api_key}</li>`;
    });
  });
}

loadKeys();
