import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home, Signin, ViewTime, ViewJobs, ExportTime, EditEmployee, AddTime, AddJob, AddEmployee, ViewEmployees, EditTime, EditJob } from './components';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './components/AuthContext';
import { createRoot } from 'react-dom/client';

const AuthChecker = () => {
  const { login, logout } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/auth', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) { 
          login(data.user);  
        } else {
          logout();
        }
      })
      .catch(error => {
        console.error('Error checking authentication status:', error);
        logout();
      });
  }, [login, logout]);

  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AuthChecker />  
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/addtime" element={<PrivateRoute element={<AddTime />} />} />
          <Route path="/addjob" element={<PrivateRoute element={<AddJob />} />} />
          <Route path="/addemployee" element={<PrivateRoute element={<AddEmployee />} />} />
          <Route path="/exporttime" element={<PrivateRoute element={<ExportTime />} />} />
          <Route path="/viewtime" element={<PrivateRoute element={<ViewTime />} />} />
          <Route path="/viewjobs" element={<PrivateRoute element={<ViewJobs />} />} />
          <Route path="/viewemployees" element={<PrivateRoute element={<ViewEmployees />} />} />
          <Route path="/editemployee/:id" element={<PrivateRoute element={<EditEmployee />} />} />
          <Route path="/edittime/:entryid" element={<PrivateRoute element={<EditTime />} />} />
          <Route path="/editjob/:workorder" element={<PrivateRoute element={<EditJob />} />} />
          <Route path="/" element={<PrivateRoute element={<Home />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

createRoot(document.getElementById('root')).render(<App />);
