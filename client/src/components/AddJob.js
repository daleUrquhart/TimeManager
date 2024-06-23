import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddJob = () => {
  const [workorder, setWorkorder] = useState('');
  const [customer, setCustomer] = useState('');
  const [property, setProperty] = useState('');
  const [address, setAddress] = useState('');

  const navigate = useNavigate();

  const handleAddJob = async (e) => {
    e.preventDefault();
  
    if (!workorder || !customer || !property || !address) {
      alert('All fields must be filled');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/jobdata/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          workorder,
          customer,
          property,
          address,
        }),
      });

      if (response.ok) {
        console.log('Job added successfully');
        navigate('/');  
      } else {
        console.error('Failed to add job');
      }
    } catch (error) {
      console.error('Error occurred while adding job:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Add Job</h1>
      <form onSubmit={handleAddJob}>
        <div className="form-group">
          <label>Workorder:</label>
          <input
            type="text"
            className="form-control"
            value={workorder}
            onChange={(e) => setWorkorder(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Customer:</label>
          <input
            type="text"
            className="form-control"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Property:</label>
          <input
            type="text"
            className="form-control"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Job
        </button>
      </form>
    </div>
  );
};

export default AddJob;
