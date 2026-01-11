import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [keys, setKeys] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:3007/api/customer";

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [resP, resK, resT] = await Promise.all([
        axios.get(`${API_URL}/api-products`, { headers }),
        axios.get(`${API_URL}/api-keys`, { headers }),
        axios.get(`${API_URL}/transactions`, { headers })
      ]);
      setProducts(resP.data);
      setKeys(resK.data);
      setTransactions(resT.data);
      
      if (resP.data.length > 0 && !selectedProduct) {
        setSelectedProduct(resP.data[0].id.toString());
      }
    } catch (err) {
      console.error("Fetch data error", err);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleAction = async (type) => {
    if (!selectedProduct) return Swal.fire('Error', 'Pilih produk dulu', 'error');
    
    const headers = { Authorization: `Bearer ${token}` };
    const payload = { api_product_id: Number(selectedProduct) };

    try {
      if (type === 'buy') {
        await axios.post(`${API_URL}/buy-product`, payload, { headers });
        Swal.fire('Berhasil!', 'Pesanan dibuat. Silakan lakukan pembayaran.', 'success');
      } else if (type === 'pay') {
        await axios.post(`${API_URL}/pay-product`, payload, { headers });
        Swal.fire('Sukses!', 'Pembayaran diterima.', 'success');
      } else if (type === 'generate') {
        const res = await axios.post(`${API_URL}/api-keys`, payload, { headers });
        Swal.fire('Berhasil!', `API Key baru telah dibuat.`, 'success');
      }
      fetchData(); 
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Terjadi kesalahan', 'error');
    }
  };

  const currentTransaction = transactions.find(t => t.api_product_id.toString() === selectedProduct);
  const currentProduct = products.find(p => p.id.toString() === selectedProduct);

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
        {!currentTransaction ? (
          <button onClick={() => handleAction('buy')}>
            Beli API
          </button>
        ) : currentTransaction.status === 'pending' ? (
          <button onClick={() => handleAction('pay')} className="btn-pay">
            Bayar Sekarang (Rp {currentProduct?.price})
          </button>
        ) : (
          <button onClick={() => handleAction('generate')} className="btn-generate">
            Generate New API Key
          </button>
        )}
      </div>

      <h2>Daftar API Key Anda</h2>
      <ul>
        {keys.filter(k => k.api_product_id.toString() === selectedProduct).map((k, i) => (
          <li key={i} className="api-key-item">
            <strong>Key:</strong> {k.api_key}
          </li>
        ))}
        {keys.filter(k => k.api_product_id.toString() === selectedProduct).length === 0 && (
          <li style={{opacity: 0.5, textAlign: 'center'}}>Belum ada key untuk produk ini.</li>
        )}
      </ul>
    </div>
  );
}