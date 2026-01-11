import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3007/api/auth/login', { email, password });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);

        // Redirect berdasarkan role dari backend
        if (res.data.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="container">
      <div className="logo">API GATEWAY</div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p className="bold">{message}</p>
    </div>
  );
};

export default Login;