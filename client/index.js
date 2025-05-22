// Initial boilerplate for starting the web app development

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import InitialDataForm from './pages/InitialDataForm';
import PersonalityNotesForm from './pages/PersonalityNotesForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/initial-form" element={<ProtectedRoute><InitialDataForm /></ProtectedRoute>} />
        <Route path="/notes-form" element={<ProtectedRoute><PersonalityNotesForm /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
