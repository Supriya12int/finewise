import React, { useEffect, useState } from 'react';
import { expensesAPI } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#4f46e5', '#06b6d4', '#ef4444', '#16a34a', '#a21caf', '#f59e42', '#db2777', '#2563eb'];

// Helper: Format number with Indian digit grouping and 2 decimals
function formatIndianNumber(num) {
  const x = num.toFixed(2).toString();
  const afterPoint = x.indexOf('.') > -1 ? x.substring(x.indexOf('.')) : '';
  let beforePoint = x.indexOf('.') > -1 ? x.substring(0, x.indexOf('.')) : x;

  const lastThree = beforePoint.substring(beforePoint.length - 3);
  const otherNumbers = beforePoint.substring(0, beforePoint.length - 3);

  if (otherNumbers !== '') {
    beforePoint = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  } else {
    beforePoint = lastThree;
  }
  return beforePoint + afterPoint;
}

export default function AnalyticsDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState('trends');

  useEffect(() => {
    const now = new Date();
    const thisYear = now.getFullYear();
    expensesAPI
      .getExpenses({
        start_date: `${thisYear}-01-01`,
        end_date: `${thisYear}-12-31`,
        limit: 1000,
      })
      .then(res => setExpenses(res.data.expenses || []));
  }, []);

  // Monthly totals - Bar Chart
  const monthlyTotals = Array(12).fill(0);
  expenses.forEach(exp => {
    const date = new Date(exp.transaction_date);
    monthlyTotals[date.getMonth()] += exp.amount;
  });
  const monthlyBarData = monthlyTotals.map((value, idx) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][idx],
    value,
  }));

  // Current month category sums - Pie Chart
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentExpenses = expenses.filter(exp => {
    const d = new Date(exp.transaction_date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const categorySums = {};
  currentExpenses.forEach(exp => {
    const cat = exp.category?.name || 'Uncategorized';
    categorySums[cat] = (categorySums[cat] || 0) + exp.amount;
  });
  const pieData = Object.entries(categorySums).map(([name, value]) => ({ name, value }));

  // Comparison this vs last month
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear -1 : currentYear;
  const currentTotal = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.transaction_date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24, fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {['trends', 'categories', 'comparison'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '12px 0',
              fontSize: '1.1rem',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              backgroundColor: activeTab === tab ? '#4f46e5' : '#f3f4f6',
              color: activeTab === tab ? 'white' : '#4b5563',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'trends' && (
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 16, color: '#4f46e5' }}>Monthly Spending Trends</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyBarData}>
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value) => `₹${formatIndianNumber(value)}`} />
              <Bar dataKey="value" fill="#4f46e5" animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {activeTab === 'categories' && (
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 16, color: '#4f46e5' }}>This Month: Spending by Category</h2>
          {pieData.length === 0 ? (
            <p>No expenses recorded for this month.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${formatIndianNumber(value)}`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>
      )}

      {activeTab === 'comparison' && (
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 16, color: '#4f46e5' }}>Comparison: This Month vs. Last Month</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div style={{
              flex: '1 1 200px',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6b7280' }}>This Month</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#4f46e5' }}>
                ₹{formatIndianNumber(currentTotal)}
              </div>
            </div>
            <div style={{
              flex: '1 1 200px',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6b7280' }}>Last Month</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#2563eb' }}>
                ₹{formatIndianNumber(lastMonthTotal)}
              </div>
            </div>
            <div style={{ flex: '1 1 200px', paddingTop: 20, textAlign: 'center' }}>
              <div style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: currentTotal >= lastMonthTotal ? '#dc2626' : '#16a34a'
              }}>
                {currentTotal >= lastMonthTotal ? '▲' : '▼'} ₹{formatIndianNumber(Math.abs(currentTotal - lastMonthTotal))}
              </div>
              <div style={{ color: '#6b7280', fontSize: 14 }}>
                {currentTotal >= lastMonthTotal ? 'Increase' : 'Decrease'} from last month
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
