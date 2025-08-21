import React from 'react';

const ExpensesList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses.length) return <p>No expenses found.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Amount</th>
          <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Category</th>
          <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Date</th>
          <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Description</th>
          <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(exp => (
          <tr key={exp.id}>
            <td style={{ padding: '0.5rem' }}>${exp.amount.toFixed(2)}</td>
            <td style={{ padding: '0.5rem' }}>{exp.category?.name || 'Uncategorized'}</td>
            <td style={{ padding: '0.5rem' }}>{new Date(exp.transaction_date).toLocaleDateString()}</td>
            <td style={{ padding: '0.5rem' }}>{exp.description}</td>
            <td style={{ padding: '0.5rem' }}>
              <button onClick={() => onEdit(exp)} style={{ marginRight: '0.5rem' }}>Edit</button>
              <button onClick={() => onDelete(exp.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpensesList;
