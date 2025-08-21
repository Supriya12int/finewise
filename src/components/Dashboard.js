import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ExpensesForm from './ExpensesForm';
import ExpensesList from './ExpensesList';
import StatsCard from './StatsCard';
import { expensesAPI } from '../services/api';
import { FaDollarSign, FaChartPie, FaCalendarAlt, FaList } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editExpense, setEditExpense] = useState(null);

  const fetchExpenses = () => {
    setLoading(true);
    expensesAPI.getExpenses()
      .then(resp => {
        setExpenses(resp.data.expenses);
        setLoading(false);
        setEditExpense(null);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSave = () => {
    fetchExpenses();
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    expensesAPI.deleteExpense(id)
      .then(() => fetchExpenses())
      .catch(() => alert('Failed to delete expense'));
  };

  // Calculate stats with useMemo to avoid unnecessary recalculations
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }, [expenses]);

  // Example preset monthly budget - you can fetch from backend or settings
  const monthlyBudget = 2000;

  const topCategory = useMemo(() => {
    const categoryMap = {};
    expenses.forEach(exp => {
      const cat = exp.category?.name || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + (exp.amount || 0);
    });
    // Find category with max total
    let maxCategory = null;
    let maxAmount = 0;
    for (const [cat, amt] of Object.entries(categoryMap)) {
      if (amt > maxAmount) {
        maxAmount = amt;
        maxCategory = cat;
      }
    }
    return maxCategory;
  }, [expenses]);

  if (loading) return <p>Loading expenses...</p>;

  return (
    <div>
      <header
        className="header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <h1>Welcome to FineWise, {user?.first_name}!</h1>
        <div>
          <button
            onClick={() => navigate('/analytics')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              marginRight: '10px',
            }}
          >
            View Analytics
          </button>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg, #f7fafc)',
        }}
      >
        <StatsCard title="Total Expenses" value={`$${totalExpenses.toFixed(2)}`} icon={<FaDollarSign />} color="var(--color-primary, #6b46c1)" />
        <StatsCard title="Monthly Budget" value={`$${monthlyBudget.toFixed(2)}`} icon={<FaCalendarAlt />} color="var(--color-accent, #319795)" />
        <StatsCard title="Top Category" value={topCategory || 'N/A'} icon={<FaChartPie />} color="#d53f8c" />
        <StatsCard title="Expense Count" value={expenses.length} icon={<FaList />} color="#ed8936" />
      </div>

      <main style={{ padding: '2rem' }}>
        <ExpensesForm onSaved={handleSave} expenseToEdit={editExpense} />
        <ExpensesList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
      </main>
    </div>
  );
};

export default Dashboard;
