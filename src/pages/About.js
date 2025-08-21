import React from 'react';
import expenseManagementImg from '../assets/student-finance.jpg';
import dataAnalysisImg from '../assets/what-is-budget-control-process-importance-benefits.jpg';
import userFriendlyImg from '../assets/woman-is-looking-at-cash-banknotes-picture-id1255783831.jpg';


const advantages = [
  'Easy expense tracking with intuitive interface',
  'Visual analytics to understand spending habits',
  'Secure and private user data protection',
  'Supports multiple categories and payment methods',
  'Mobile-friendly design accessible on any device',
];

const disadvantages = [
  'Limited to personal expense management (no business features)',
  'Requires manual entry of transactions',
  'No automated bank sync currently',
  'Basic reporting for premium analytics could be added',
];

const images = [
  expenseManagementImg,
  dataAnalysisImg,
  userFriendlyImg,
];

const About = () => (
  <div style={{ maxWidth: 900, margin: 'auto', padding: '2rem' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary)' }}>
      About FineWise
    </h2>

    <section style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '0.75rem' }}>Who is FineWise useful for?</h3>
      <p style={{ lineHeight: 1.6 }}>
        FineWise is perfect for anyone looking to take control of their personal finances. Whether you're a college student managing a budget,
        a young professional tracking monthly expenses, or a family planning household spending — FineWise helps you stay organized, save money,
        and gain insights into your habits.
      </p>
    </section>

    <section style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '0.75rem' }}>What are the advantages?</h3>
      <ul>
        {advantages.map((adv, index) => (
          <li key={index} style={{ marginBottom: '0.5rem' }}>✅ {adv}</li>
        ))}
      </ul>
    </section>

    <section style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '0.75rem' }}>What are the limitations?</h3>
      <ul>
        {disadvantages.map((disadv, index) => (
          <li key={index} style={{ marginBottom: '0.5rem' }}>⚠️ {disadv}</li>
        ))}
      </ul>
    </section>

    <section>
      <h3 style={{ marginBottom: '0.75rem' }}>Visual Features</h3>
      <div style={{
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
      }}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="Feature"
            style={{ width: '250px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}
          />
        ))}
      </div>
    </section>
  </div>
);

export default About;
