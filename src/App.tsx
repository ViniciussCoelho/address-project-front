import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { ProtectedRoute } from './components/protected-route';
import { Signup } from './pages/signup';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <Routes>
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/login" />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default App
