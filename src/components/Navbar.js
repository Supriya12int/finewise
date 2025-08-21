import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import ProfileMenu from './ProfileMenu';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? 'active-link' // You can add your CSS classes here
      : 'nav-link';

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <NavLink to="/" className={linkClass}>Home</NavLink>
        <NavLink to="/about" className={linkClass}>About</NavLink>
        {isAuthenticated && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
        {isAuthenticated && <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ThemeToggle />
        {isAuthenticated ? (
          <ProfileMenu />
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <NavLink to="/signup" className={linkClass}>Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
