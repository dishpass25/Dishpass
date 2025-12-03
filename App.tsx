import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Restaurants } from './pages/Restaurants';
import { RestaurantDetails } from './pages/RestaurantDetails';
import { Credits } from './pages/Credits';
import { Referrals } from './pages/Referrals';
import { Community } from './pages/Community';
import { Profile } from './pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/restaurants" element={<Layout><Restaurants /></Layout>} />
      <Route path="/restaurant/:id" element={<Layout><RestaurantDetails /></Layout>} />
      <Route path="/credits" element={<Layout><Credits /></Layout>} />
      <Route path="/referrals" element={<Layout><Referrals /></Layout>} />
      <Route path="/community" element={<Layout><Community /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}