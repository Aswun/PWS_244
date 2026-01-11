import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', description: '', price: '' });
  const token = localStorage.getItem('token');
  const API_URL = "http://localhost:3007/api/admin/api-products";

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
    setProducts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `${API_URL}/${form.id}` : API_URL;
    
    await axios[method](url, form, { headers: { Authorization: `Bearer ${token}` } });
    setForm({ id: '', name: '', description: '', price: '' });
    loadProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    loadProducts();
  };

  return (
    <div className="container">
      <div className="logo">ADMIN PANEL</div>
      <h2>API Products Management</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="API Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
        <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
        <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} />
        <button type="submit">{form.id ? 'Update' : 'Add'} Product</button>
      </form>
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
};

export default AdminDashboard;