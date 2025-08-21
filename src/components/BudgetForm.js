import React, { useState, useEffect } from 'react';
import { categoriesAPI, budgetsAPI } from '../services/api';

export default function BudgetForm({ onSaved, budgetToEdit }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    amount: '',
    period: 'monthly',
    alert_threshold_percent: 80,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    categoriesAPI.getCategories()
      .then(res => setCategories(res.data.categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (budgetToEdit) {
      setForm({
        name: budgetToEdit.name,
        category_id: budgetToEdit.category?.id || '',
        amount: budgetToEdit.amount,
        period: budgetToEdit.period,
        alert_threshold_percent: budgetToEdit.alertThresholdPercent || 80,
      });
    }
  }, [budgetToEdit]);

  const handleChange = (e) => {
    const val = e.target.name === 'amount' || e.target.name === 'alert_threshold_percent'
      ? Number(e.target.value)
      : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (budgetToEdit) {
        await budgetsAPI.updateBudget(budgetToEdit.id, form);
      } else {
        await budgetsAPI.createBudget(form);
      }
      onSaved();
      setForm({
        name: '',
        category_id: '',
        amount: '',
        period: 'monthly',
        alert_threshold_percent: 80,
      });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save budget');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow space-y-4">
      <h3 className="text-xl font-semibold">{budgetToEdit ? 'Edit Budget' : 'Create Budget'}</h3>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Budget Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <select
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        min="0"
        step="0.01"
        value={form.amount}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <select
        name="period"
        value={form.period}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
        <option value="yearly">Yearly</option>
      </select>

      <input
        type="number"
        name="alert_threshold_percent"
        placeholder="Alert Threshold (%)"
        min="1"
        max="100"
        value={form.alert_threshold_percent}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        {budgetToEdit ? 'Update Budget' : 'Create Budget'}
      </button>
    </form>
  );
}
