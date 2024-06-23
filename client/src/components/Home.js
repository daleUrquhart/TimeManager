import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();  

  const signOut = () => {
    fetch('http://localhost:5000/api/auth/signout', {
      method: 'POST',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        window.location.reload();
      })
      .catch(error => console.error('Error signing out:', error));
  };

  return (
    <div className="container mt-5">
      <h1>Home</h1>
      {isAuthenticated ? (
        <div>
          <p>Welcome! You are authenticated.</p>
          {isAdmin && (
            <>
              <p>Admin Tools</p>
              <div className="button-group">
                <Link to="/viewemployees" className="btn btn-primary mb-2">View Employees</Link>
              </div>
            </>
          )}
          <div>
            <p>Employee Tools</p>
            <div className="button-group">
              <Link to="/viewjobs" className="btn btn-primary mb-2">Jobs</Link>
              <Link to="/viewtime" className="btn btn-primary mb-2">Time</Link>
              <button onClick={signOut} className="btn btn-danger mb-2">Sign Out</button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>Sign in to manage time entries</p>
          <div className="button-group">
            <Link to="/signin" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
