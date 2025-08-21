import React from 'react';
import heroImage from '../assets/background.jpeg'; // Your actual image path

const LandingPage = () => (
  <div
    className="landing-background fadeIn"
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      minHeight: '80vh',
      padding: '4rem',
      gap: '3rem',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <div
      style={{
        flex: '1 1 400px',
        maxWidth: '500px',
        textShadow: '0 0 10px rgba(0,0,0,0.7)',
        color: 'var(--landing-text-color)',
      }}
    >
      <h1
        style={{
          fontSize: '4rem',
          fontWeight: '900',
          marginBottom: '1rem',
          lineHeight: 1.1,
          textShadow: 'var(--landing-text-shadow)',
        }}
      >
        Welcome to FineWise
      </h1>
      <p
        style={{
          fontSize: '1.5rem',
          marginBottom: '2rem',
          lineHeight: 1.5,
          textShadow: 'var(--landing-text-shadow)',
        }}
      >
        Take control of your finances. Track expenses with ease and insight.
      </p>
      <div>
        <a
          href="/signup"
          style={{
            textDecoration: 'none',
            padding: '1.2rem 2.5rem',
            background: 'linear-gradient(45deg, #6b46c1, #8f5cf7)',
            color: 'white',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            marginRight: '1.5rem',
            boxShadow: '0 8px 20px rgba(111, 66, 193, 0.6)',
            display: 'inline-block',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(111, 66, 193, 0.8)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(111, 66, 193, 0.6)';
          }}
        >
          Get Started
        </a>
        <a
          href="/login"
          style={{
            textDecoration: 'none',
            padding: '1.2rem 2.5rem',
            border: '2px solid var(--color-primary)',
            color: 'var(--color-primary)',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            boxShadow: '0 4px 15px rgba(111, 66, 193, 0.5)',
            display: 'inline-block',
            transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-primary)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Log In
        </a>
      </div>
    </div>
    <div
      style={{
        flex: '1 1 400px',
        textAlign: 'center',
      }}
    >
      <img
        src={heroImage}
        alt="Finance illustration"
        style={{ maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))' }}
      />
    </div>
  </div>
);

export default LandingPage;
