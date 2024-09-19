import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
// import Chat from './pages/Chat';
import WorkSpace from './pages/Workspace';
const isAuthenticated = () => {
  // This should be replaced with actual authentication logic
  return !!localStorage.getItem('token');
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/workspace" /> : <Login />} />
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/workspace" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated() ? <Navigate to="/workspace" /> : <Signup />} />
        <Route path="/workspace" element={isAuthenticated() ? <WorkSpace /> : <Navigate to="/login" />} />

      </Routes>
    </Router>
  );
};

export default App;
