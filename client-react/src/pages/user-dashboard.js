import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [myKeys, setMyKeys] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const resProd = await axios.get('http://localhost:3007/api/customer/api-products', { headers });
      const resKeys = await axios.get('http://localhost:3007/api/customer/api-keys', { headers });
      setProducts(resProd.data);
      setMyKeys(resKeys.data);
    };
    fetchData();
  }, [token]);

  const generateKey = async () => {
    await axios.post('http://localhost:3007/api/customer/api-keys', 
      { api_product_id: selectedProduct },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Refresh list keys setelah generate [cite: 7]
    window.location.reload(); 
  };

  return (
    <div className="container">
      <div className="logo">USER DASHBOARD</div>
      <h2>Generate API Key</h2>
      <select onChange={(e) => setSelectedProduct(e.target.value)}>
        <option value="">Select Product</option>
        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <button onClick={generateKey}>Generate</button>
      <h2>My API Keys</h2>
      <ul>
        {myKeys.map(k => <li key={k.id}>{k.api_key} (Status: {k.status})</li>)}
      </ul>
    </div>
  );
};

export default UserDashboard;