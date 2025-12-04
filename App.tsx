import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Feed } from './pages/Feed';
import { ProductForm } from './pages/ProductForm';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { Chat } from './pages/Chat';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Help } from './pages/Help';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Carregando...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout hideNav><Landing /></Layout>} />
            <Route path="/login" element={<Layout hideNav><Login /></Layout>} />
            <Route path="/terms" element={<Layout hideNav><Terms /></Layout>} />
            <Route path="/privacy" element={<Layout hideNav><Privacy /></Layout>} />
            <Route path="/help" element={<Layout hideNav><Help /></Layout>} />
            
            <Route path="/app" element={
                <ProtectedRoute>
                    <Layout><Feed /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
                <ProtectedRoute>
                    <Layout hideNav={false}><ProductDetails /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/sell" element={
                <ProtectedRoute>
                    <Layout hideNav><ProductForm /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/cart" element={
                <ProtectedRoute>
                    <Layout><Cart /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Layout><Profile /></Layout>
                </ProtectedRoute>
            } />
             <Route path="/chat" element={
                <ProtectedRoute>
                    <Layout><Chat /></Layout>
                </ProtectedRoute>
            } />
        </Routes>
    )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StoreProvider>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
      </StoreProvider>
    </AuthProvider>
  );
};

export default App;