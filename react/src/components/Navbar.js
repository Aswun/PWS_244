import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear(); // Menghapus token dan role
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">API GATEWAY</div>
      <div className="nav-links">
        {!token ? (
          <>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/register" className="nav-item">Register</Link>
          </>
        ) : (
          <>
            {/* Link tambahan berdasarkan role jika diperlukan */}
            <span className="nav-user">Role: {role}</span>
            <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}