import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Pastikan sudah install: npm install sweetalert2

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', description: '', price: '' });
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:3007/api/admin";

  // Fungsi untuk memuat semua produk
  const loadProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api-products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Gagal memuat produk", err);
    }
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Menangani Tambah atau Update Produk
  const handleSubmit = async () => {
    // Validasi input kosong
    if (!form.name || !form.description || !form.price) {
      return Swal.fire('Peringatan', 'Semua kolom harus diisi!', 'warning');
    }

    const method = form.id ? "put" : "post";
    const url = form.id ? `${API_URL}/api-products/${form.id}` : `${API_URL}/api-products`;
    
    try {
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire({
        title: 'Berhasil!',
        text: `Produk berhasil ${form.id ? 'diperbarui' : 'ditambahkan'}.`,
        icon: 'success',
        confirmButtonColor: '#e5c3bd' // Warna Rose tema Anda
      });

      setForm({ id: '', name: '', description: '', price: '' });
      loadProducts();
    } catch (err) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  // Menangani Hapus Produk dengan Konfirmasi
  const deleteProduct = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Produk yang dihapus tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e5c3bd',
      cancelButtonColor: '#4d5b6f',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/api-products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('Terhapus!', 'Produk telah dihapus.', 'success');
          loadProducts();
        } catch (err) {
          Swal.fire('Gagal', 'Gagal menghapus produk.', 'error');
        }
      }
    });
  };

  // Mengisi form untuk edit
  const editProduct = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price
    });
    // Scroll ke atas agar admin tahu form sudah terisi
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <div className="logo">ADMIN PANEL</div>
      <h2>Kelola API Produk</h2>
      
      <div className="admin-form">
        <input 
          placeholder="Nama API" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
        />
        <input 
          placeholder="Deskripsi Singkat" 
          value={form.description} 
          onChange={e => setForm({...form, description: e.target.value})} 
        />
        <input 
          type="number"
          placeholder="Harga (Rp)" 
          value={form.price} 
          onChange={e => setForm({...form, price: e.target.value})} 
        />
        <button onClick={handleSubmit}>
          {form.id ? "Update Produk" : "Tambah Produk"}
        </button>
        {form.id && (
          <button 
            style={{ backgroundColor: 'transparent', color: 'var(--white)', border: '1px solid var(--white)', marginTop: '5px' }}
            onClick={() => setForm({ id: '', name: '', description: '', price: '' })}
          >
            Batal Edit
          </button>
        )}
      </div>

      <h2 style={{ marginTop: '40px' }}>Daftar Produk</h2>
      <ul id="products">
        {products.length === 0 ? (
          <li style={{ textAlign: 'center', opacity: 0.6 }}>Belum ada produk API.</li>
        ) : (
          products.map(p => (
            <li key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div>
                <b style={{ color: 'var(--rose)' }}>{p.name}</b> 
                <span style={{ fontSize: '12px', marginLeft: '10px', opacity: 0.8 }}>- Rp {p.price}</span>
              </div>
              <div style={{ fontSize: '13px', fontStyle: 'italic', marginBottom: '10px' }}>{p.description}</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => editProduct(p)} 
                  style={{ fontSize: '12px', padding: '5px', backgroundColor: 'var(--skyblue)', width: '70px' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteProduct(p.id)} 
                  style={{ fontSize: '12px', padding: '5px', backgroundColor: '#ff6b6b', color: 'white', width: '70px' }}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}