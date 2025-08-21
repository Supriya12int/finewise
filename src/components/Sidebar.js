import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'block px-4 py-2 rounded bg-indigo-600 text-white font-semibold'
      : 'block px-4 py-2 rounded hover:bg-indigo-200';

  return (
    <nav className="w-48 h-screen bg-gray-100 p-4 space-y-4">
      <NavLink to="/dashboard" className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/analytics" className={linkClass}>
        Analytics
      </NavLink>
      <button 
        onClick={handleLogout} 
        className="w-full text-left px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
  );
}
