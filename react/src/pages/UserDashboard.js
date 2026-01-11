import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [keys, setKeys] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:3007/api/customer";

  // Fungsi untuk memuat data dari server
  const fetchData = async () => {
    try {
      // Mengambil daftar produk yang tersedia
      const resProducts = await axios.get(`${API_URL}/api-products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(resProducts.data);

      // Set default selected product jika data tersedia
      if (resProducts.data.length > 0) {
        setSelectedProduct(resProducts.data[0].id);
      }

      // Mengambil daftar API Key milik user
      const resKeys = await axios.get(`${API_URL}/api-keys`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKeys(resKeys.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Fungsi untuk generate API Key baru
  const generateKey = async () => {
    // Validasi: Jika produk belum dipilih atau daftar produk kosong
    if (!selectedProduct) {
      alert("Silakan pilih produk terlebih dahulu sebelum melakukan generate API!");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api-keys`, 
        { api_product_id: selectedProduct },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Berhasil! API Key baru Anda: " + res.data.apiKey);
      
      // Refresh daftar kunci agar API key yang baru dibuat langsung muncul
      fetchData(); 
    } catch (err) {
      alert("Gagal melakukan generate API Key.");
    }
  };

  return (
    <div className="container">
      <div className="logo">USER DASHBOARD</div>
      
      <h2>Generate API Key</h2>
      
      {/* Tampilan Kondisional jika produk kosong */}
      {products.length === 0 ? (
        <p className="bold" style={{ color: 'var(--rose)' }}>
          Belum ada produk tersedia. Anda belum bisa membuat API Key.
        </p>
      ) : (
        <>
          <select 
            value={selectedProduct} 
            onChange={e => setSelectedProduct(e.target.value)}
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button onClick={generateKey}>Generate</button>
        </>
      )}

      <h2>My API Keys</h2>
      {/* List untuk melihat API Keys yang telah dibuat */}
      <ul>
        {keys.length === 0 ? (
          <li style={{ textAlign: 'center', opacity: 0.6 }}>Anda belum memiliki API Key.</li>
        ) : (
          keys.map((k, index) => (
            <li key={index} style={{ wordBreak: 'break-all' }}>
              <strong>Key:</strong> {k.api_key}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}