import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import About from './pages/About.jsx';
import Quote from './pages/Quote.jsx';
import { useAuth } from './admin/context/AuthContext.jsx';
import Login from './admin/pages/Login.jsx';
import DashboardLayout from './admin/layouts/DashboardLayout.jsx';
import Dashboard from './admin/pages/Dashboard.jsx';
import Customers from './admin/pages/Customers.jsx';
import CustomerDetail from './admin/pages/CustomerDetail.jsx';
import Jobs from './admin/pages/Jobs.jsx';
import JobDetail from './admin/pages/JobDetail.jsx';
import Staff from './admin/pages/Staff.jsx';
import Vehicles from './admin/pages/Vehicles.jsx';
import Invoices from './admin/pages/Invoices.jsx';
import LiveOps from './admin/pages/LiveOps.jsx';
import Settings from './admin/pages/Settings.jsx';
import Marketing from './admin/pages/Marketing.jsx';
import Reports from './admin/pages/Reports.jsx';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-brand-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Admin login (no public layout) */}
      <Route path="/login" element={<Login />} />

      {/* Admin — protected, shares paths with marketing since auth gate prevents public access */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Customers />} />
        <Route path=":id" element={<CustomerDetail />} />
      </Route>
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Jobs />} />
        <Route path=":id" element={<JobDetail />} />
      </Route>
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Staff />} />
      </Route>
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Vehicles />} />
      </Route>
      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Invoices />} />
      </Route>
      <Route
        path="/live-ops"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LiveOps />} />
      </Route>
      <Route
        path="/marketing"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Marketing />} />
      </Route>
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Reports />} />
      </Route>
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Settings />} />
      </Route>

      {/* Public marketing site */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/services"
        element={
          <Layout>
            <Services />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/quote"
        element={
          <Layout>
            <Quote />
          </Layout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}