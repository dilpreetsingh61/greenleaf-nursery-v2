import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import AuxGrid from './pages/AuxGrid';
import Care from './pages/Care';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Gifting from './pages/Gifting';
import Home from './pages/Home';
import Orders from './pages/Orders';
import Services from './pages/Services';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="auth-login" element={<AuthLogin />} />
          <Route path="auth-register" element={<AuthRegister />} />
          <Route path="auth/login" element={<AuthLogin />} />
          <Route path="auth/register" element={<AuthRegister />} />
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="pots" element={<AuxGrid category="pots" />} />
          <Route path="tools" element={<AuxGrid category="tools" />} />
          <Route path="care" element={<Care />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="contact" element={<Contact />} />
          <Route path="gifting" element={<Gifting />} />
          <Route path="orders" element={<Orders />} />
          <Route path="services" element={<Services />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
