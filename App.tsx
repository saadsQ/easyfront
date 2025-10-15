import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/Auth/LoginPage';
import { LogoutPage } from './components/Auth/LogoutPage';
import { ErrorPage } from './components/Error/ErrorPage';
import { LoadingSpinner } from './components/Layout/LoadingSpinner';
import { useErrorHandler } from './hooks/useErrorHandler';
import Sidebar from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Vehicles from './components/Vehicles/Vehicles';
import Clients from './components/Clients/Clients';
import { Suppliers } from './components/Suppliers/Suppliers';
import { EnhancedSupplier } from './components/Suppliers/EnhancedSupplier';
import { InventoryPage } from './components/Inventory/Inventory';
import ClientVehicleManagement from './components/Unified/ClientVehicleManagement';

// Wrapper component to handle protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Main app content that requires authentication
const AuthenticatedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { error, clearError } = useErrorHandler();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'unified':
        return <ClientVehicleManagement />;
      case 'vehicles':
        return <Vehicles />;
      case 'clients':
        return <Clients />;
      case 'suppliers':
        return <Suppliers />;
      case 'enhanced-suppliers':
        return <EnhancedSupplier />;
      case 'inventory':
        return <InventoryPage />;
      default:
        return <Dashboard />;
    }
  };

  // Show error page if there's an error
  if (error.hasError) {
    return (
      <ErrorPage
        errorCode={error.errorCode}
        errorMessage={error.errorMessage}
        onRetry={clearError}
        onGoHome={() => {
          clearError();
          window.location.href = '/';
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Main App component with routing
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;