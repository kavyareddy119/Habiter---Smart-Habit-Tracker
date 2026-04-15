import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Stats from './pages/Stats.jsx';
import Layout from './components/Layout.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid place-items-center h-screen text-sm opacity-60">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stats" element={<Stats />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
