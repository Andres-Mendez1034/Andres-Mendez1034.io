import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import './styles/main.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRouter />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
