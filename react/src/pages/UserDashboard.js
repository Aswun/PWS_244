import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [keys, setKeys] = useState([]);
  const [purchasedIds, setPurchasedIds] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState('');
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:3007/api/customer";

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [resP, resK, resT] = await Promise.all([
        axios.get(`${API_URL}/api-products`, { headers }),
        axios.get(`${API_URL}/api-keys`, { headers }),
        axios.get(`${API_URL}/transactions`, { headers })
      ]);

      setProducts(resP.data);
      setKeys(resK.data);
      setPurchasedIds(resT.data.map(t => t.api_product_id));

      if (resP.data.length > 0 && !selectedProduct) {
        setSelectedProduct(resP.data[0].id.toString());
      }
    } catch (err) {
      console.error("Gagal memuat data", err);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleBuy = async () => {
    try {
      await axios.post(`${API_URL}/buy-product`, 
        { api_product_id: selectedProduct },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Pembelian Berhasil!");
      fetchData(); 
    } catch (err) {
      alert("Gagal membeli produk.");
    }
  };

  const handleGenerate = async () => {
    try {
      const res = await axios.post(`${API_URL}/api-keys`, 
        { api_product_id: selectedProduct },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("API Key Berhasil Dibuat: " + res.data.apiKey);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal generate key.");
    }
  };

  const isOwned = purchasedIds.includes(parseInt(selectedProduct));
  const currentProduct = products.find(p => parseInt(p.id) === parseInt(selectedProduct));

  return (
    <div className="container">
      <div className="logo">USER DASHBOARD</div>
      
      <h2>Pilih API Produk</h2>
      <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.name} - Rp {p.price}</option>
        ))}
      </select>

      <div style={{ marginTop: '20px' }}>
        {isOwned ? (
          // PASTIKAN onClick di bawah ini memiliki 'handleGenerate', tidak kosong atau hanya komentar
          <button onClick={handleGenerate} style={{ backgroundColor: 'var(--skyblue)', color: 'var(--bluegray)' }}>
            Generate API Key
          </button>
        ) : (
          <button onClick={handleBuy}>
            Beli API ({currentProduct ? `Rp ${currentProduct.price}` : 'Pilih Produk'})
          </button>
        )}
      </div>

      <h2>My API Keys</h2>
      <ul>
        {keys.length === 0 ? (
          <li>Belum ada API Key.</li>
        ) : (
          keys.map((k, i) => (
            <li key={i}>
              <strong>{products.find(p => p.id === k.api_product_id)?.name}:</strong> 
              <br/>{k.api_key}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}