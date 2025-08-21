import React, { useState, useEffect } from 'react';

const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Net Banking',
  'Other',
];

export default function ExpensesForm({ onSaved, expenseToEdit }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: '',
    category: '',
    vendor: '',
    location: '',
    paymentMethod: '',
    notes: '',
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        amount: expenseToEdit.amount || '',
        description: expenseToEdit.description || '',
        date: expenseToEdit.transaction_date ? expenseToEdit.transaction_date.slice(0, 10) : '',
        category: expenseToEdit.category?.id || '',
        vendor: expenseToEdit.vendor || '',
        location: expenseToEdit.location || '',
        paymentMethod: expenseToEdit.paymentMethod || '',
        notes: expenseToEdit.notes || '',
      });
    } else {
      setFormData({
        amount: '',
        description: '',
        date: '',
        category: '',
        vendor: '',
        location: '',
        paymentMethod: '',
        notes: '',
      });
    }
  }, [expenseToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation can be added here

    // Call API to save expense using formData
    // On success:
    onSaved();
    // Clear form if needed
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--card-shadow)', marginBottom: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div>
          <label htmlFor="amount" style={{ fontWeight: '600' }}>Amount</label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            placeholder="Enter amount"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="date" style={{ fontWeight: '600' }}>Date</label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label htmlFor="description" style={{ fontWeight: '600' }}>Description</label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            placeholder="Enter description"
          />
        </div>

        <div>
          <label htmlFor="category" style={{ fontWeight: '600' }}>Category</label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="" disabled>Select category</option>
            {/* Replace with your real categories */}
            <option value="1">Food</option>
            <option value="2">Travel</option>
            <option value="3">Shopping</option>
            <option value="4">Bills</option>
          </select>
        </div>

        <div>
          <label htmlFor="vendor" style={{ fontWeight: '600' }}>Vendor Name</label>
          <input
            type="text"
            name="vendor"
            id="vendor"
            value={formData.vendor}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            placeholder="Enter vendor name"
          />
        </div>

        <div>
          <label htmlFor="location" style={{ fontWeight: '600' }}>Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            placeholder="Enter location"
          />
        </div>

        <div>
          <label htmlFor="paymentMethod" style={{ fontWeight: '600' }}>Payment Method</label>
          <select
            name="paymentMethod"
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="" disabled>Select payment method</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="notes" style={{ fontWeight: '600' }}>Notes</label>
          <textarea
            name="notes"
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
            placeholder="Additional notes"
          />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <button
          type="submit"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {expenseToEdit ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
