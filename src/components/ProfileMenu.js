import React from 'react';

const styles = {
  card: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--card-shadow)',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'background-color var(--transition), box-shadow var(--transition)',
    cursor: 'default',
  },
  cardHover: {
    boxShadow: '0 6px 20px rgba(101, 101, 125, 0.15)',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    flexShrink: 0,
    fontSize: '1.5rem',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontWeight: 700,
    fontSize: '1.25rem',
    marginBottom: '0.3rem',
    color: 'var(--color-text)',
  },
  value: {
    fontSize: '1.5rem',
    color: 'var(--color-text)',
  },
};

export default function StatsCard({ title, value, icon, color }) {
  // To simulate hover effect using state (optional):
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.icon, backgroundColor: color }}>{icon}</div>
      <div style={styles.textContainer}>
        <div style={styles.title}>{title}</div>
        <div style={styles.value}>{value}</div>
      </div>
    </div>
  );
}
