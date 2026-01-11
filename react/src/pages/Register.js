import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:3007/api";

export default function Register() {
  // State untuk menyimpan input dari form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Menangani perubahan pada setiap input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Fungsi untuk mengirim data pendaftaran ke server
  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      setMessage(res.data.message);

      // Jika berhasil, arahkan pengguna ke halaman login setelah 1 detik
      if (res.data.message === "Register success") {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      // Menangani error dari server
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="container">
      <div className="logo">API GATEWAY</div>

      <h2>Register</h2>

      {/* Input dikontrol oleh state React */}
      <input 
        type="text" 
        id="name" 
        placeholder="Name" 
        value={formData.name}
        onChange={handleChange}
      />
      <input 
        type="email" 
        id="email" 
        placeholder="Email" 
        value={formData.email}
        onChange={handleChange}
      />
      <input 
        type="password" 
        id="password" 
        placeholder="Password" 
        value={formData.password}
        onChange={handleChange}
      />

      <button onClick={handleRegister}>Create Account</button>

      {/* Menampilkan pesan status pendaftaran */}
      <p className="bold">{message}</p>
    </div>
  );
}