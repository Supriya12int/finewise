import React, { useState } from 'react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation & API signup call here
    alert('Signup functionality not implemented yet.');
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', padding: '2rem', boxShadow: 'var(--card-shadow)', borderRadius: 'var(--border-radius)', backgroundColor: 'var(--color-surface)' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          style={{ marginBottom: '1rem' }}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          style={{ marginBottom: '1rem' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginBottom: '1rem' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          style={{ marginBottom: '1rem' }}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          style={{ marginBottom: '1.5rem' }}
        />
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Create Account
        </button>
      </form>
    </div>
  );
}
