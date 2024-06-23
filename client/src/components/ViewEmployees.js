import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employee/', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees);
      } else {
        console.error('Error fetching employees:', response.statusText);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const handleEdit = (id) => {
    navigate(`/editemployee/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employee/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
      } else {
        console.error('Failed to delete employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleExportAll = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employee/export', {
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'all_employees.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Error exporting all employee data:', response.statusText);
      }
    } catch (error) {
      console.error('Error exporting all employee data:', error);
    }
  };

  const handleAddEmployee = () => {
    navigate('/addemployee');
  };

  return (
    <div className="container mt-5">
      <h2>Employees List</h2>
      <button className="btn btn-primary mb-3 me-3" onClick={handleAddEmployee}>Add Employee</button>
      <button className="btn btn-primary mb-3" onClick={handleExportAll}>Export All Employees as PDF</button>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Date Started</th>
            <th>Access</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.address}</td>
              <td>{employee.phonenumber}</td>
              <td>{employee.email}</td>
              <td>{employee.datestarted}</td>
              <td>{employee.access}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(employee.id)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewEmployees;
