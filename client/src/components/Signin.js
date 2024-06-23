import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitting signin form with', { employeeId, password });

    fetch('http://localhost:5000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: employeeId, password }),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Received response:', data);
        if (data.message === 'Signin successful') { 
          login(data.user); 
          navigate('/');
        } else {
          console.error('Login failed:', data.message);
        }
      })
      .catch(error => {
        console.error('Error during sign-in:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input 
          type="number" 
          value={employeeId} 
          onChange={(e) => setEmployeeId(e.target.value)} 
          placeholder="Employee ID" 
          required 
        />
      </div>
      <br />
      <div>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
      </div>
      <br />
      <div>
        <button type="submit">Sign In</button>
      </div>
    </form>
  );
};

export default Signin;
