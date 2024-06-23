import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    address: '',
    phonenumber: '',
    email: '',
    datestarted: '',
    access: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/employee/${id}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setEmployee(data.employee);
        } else {
          console.error('Failed to fetch employee');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/employee/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee),
        credentials: 'include'
      });
      if (response.ok) {
        navigate('/viewemployees');
      } else {
        console.error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={employee.name} onChange={handleChange} required />
        <br />
        <label>Address:</label>
        <input type="text" name="address" value={employee.address} onChange={handleChange} required />
        <br />
        <label>Phone Number:</label>
        <input type="text" name="phonenumber" value={employee.phonenumber} onChange={handleChange} required />
        <br />
        <label>Email:</label>
        <input type="email" name="email" value={employee.email} onChange={handleChange} required />
        <br />
        <label>Date Started:</label>
        <input type="date" name="datestarted" value={employee.datestarted} onChange={handleChange} required />
        <br />
        <label>Access:</label>
        <input type="text" name="access" value={employee.access} onChange={handleChange} required />
        <br />
        <button type="submit">Update Employee</button>
      </form>
    </div>
  );
};

export default EditEmployee;
