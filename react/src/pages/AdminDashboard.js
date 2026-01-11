import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', description: '', price: '' });
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:3007/api/admin";

  const loadProducts = useCallback(async () => {
    const res = await axios.get(`${API_URL}/api-products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(res.data);
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSubmit = async () => {
    const method = form.id ? "put" : "post";
    const url = form.id ? `${API_URL}/api-products/${form.id}` : `${API_URL}/api-products`;
    
    await axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setForm({ id: '', name: '', description: '', price: '' });
    loadProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/api-products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    loadProducts();
  };

  return (
    <div className="container">
      <div className="logo">ADMIN PANEL</div>
      <h2>API Products</h2>
      <input placeholder="API Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
      <input placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
      <button onClick={handleSubmit}>{form.id ? "Update Product" : "Add Product"}</button>
      
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <b>{p.name}</b> - {p.price}
            <button onClick={() => setForm(p)}>Edit</button>
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}