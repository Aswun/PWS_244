import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Cek status login

  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token saat logout
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="logo" style={styles.logo}>API GATEWAY</div>
      <div style={styles.links}>
        {!token ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <>
            {/* Tombol Logout hanya muncul jika sudah login  */}
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Mengikuti tema container
    borderBottom: '1px solid #a3c1cd'
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e5c3bd', // Warna Rose
    margin: 0
  },
  links: {
    display: 'flex',
    gap: '20px'
  },
  link: {
    color: '#a3c1cd', // Warna Skyblue
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#e5c3bd', // Warna Rose
    border: '1px solid #e5c3bd',
    padding: '5px 15px',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: 'bold'
  }
};

export default Navbar;