import React from 'react';
import { ThemeProvider } from './themes/ThemeContext';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import About from './pages/About';
import ExpensesForm from './components/ExpensesForm';
import ExpensesList from './components/ExpensesList';
import { expensesAPI } from './services/api';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ThemeToggle from './components/ThemeToggle'; // Make sure ThemeToggle.js is properly created
import './App.css';


// --- Navbar component ---
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = {
    marginRight: '1rem',
    textDecoration: 'none',
    color: '#4f46e5',
    fontWeight: 'bold',
  };

  return (
    <nav
      style={{
        padding: '1rem',
        borderBottom: '1px solid #ddd',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        {isAuthenticated && <Link to="/dashboard" style={linkStyle}>Dashboard</Link>}
        {isAuthenticated && <Link to="/analytics" style={linkStyle}>Analytics</Link>}
        <Link to="/about" style={linkStyle}>About</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ThemeToggle />
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: '1rem' }}>Hello, {user?.first_name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/signup" style={linkStyle}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};





// --- Dashboard component definition ---
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editExpense, setEditExpense] = React.useState(null);

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

  React.useEffect(() => {
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

  if (loading) return <p>Loading expenses...</p>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
            Welcome to FineWise, {user?.first_name}!
          </h1>
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
        </div>
      </div>
      <div style={{ padding: '2rem' }}>
        <ExpensesForm onSaved={handleSave} expenseToEdit={editExpense} />
        <ExpensesList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};


// --- ProtectedRoute wrapper ---
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};


// --- Main App ---
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
