import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WorkSpace from './pages/Workspace';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/workspace" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/workspace" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/workspace" /> : <Signup />} />
        <Route path="/workspace" element={isAuthenticated ? <WorkSpace /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
