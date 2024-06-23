import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    phonenumber: '',
    email: '',
    datestarted: '',
    password: '',
    access: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
 
    if (!formData.id || isNaN(formData.id)) {
      alert('Please enter a valid Employee ID (numeric value)');
      return;
    }
 
    const accessValue = parseInt(formData.access);
    if (!isNaN(accessValue) && (accessValue !== 0 && accessValue !== 1)) {
      alert('Access value should be either 0 or 1');
      return;
    }

    fetch('http://localhost:5000/api/employee/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.employee) {
          console.log('Employee added successfully');
          alert('Employee added successfully');
          navigate('/');
        } else {
          console.log('Failed to add employee: ' + data.message);
          alert('Failed to add employee: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the employee');
      });
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <input type="number" name="id" value={formData.id} onChange={handleChange} required />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone Number:</label>
          <InputMask
            mask="999-999-9999"
            maskChar="_"
            type="text"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            required
          />
          <small>Format: 999-999-9999</small>
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Date Started:</label>
          <input type="date" name="datestarted" value={formData.datestarted} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Access:</label>
          <select name="access" value={formData.access} onChange={handleChange} required>
            <option value="">Select Access</option>
            <option value="0">0 - Admin</option>
            <option value="1">1 - User</option>
          </select>
        </div>
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
