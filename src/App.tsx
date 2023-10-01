import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/home';
import { Login } from './pages/login';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App
