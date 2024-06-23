import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ViewJobs = () => {
  const { isAdmin } = useAuth();  
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobdata', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.jobData)) {
          const sortedJobs = data.jobData.sort((a, b) => a.Customer.localeCompare(b.Customer));
          setJobs(sortedJobs);
        } else {
          console.error('Unexpected response data:', data.jobData);
          setJobs([]);
        }
      } else {
        console.error('Error fetching job data:', response.statusText);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
      setJobs([]);
    }
  };

  const handleEdit = (workorder) => {
    console.log("Editing job with workorder:", workorder);
    navigate(`/editjob/${workorder}`);
  };

  const handleDelete = async (workorder) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobdata/delete/${workorder}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentJob: false }),
        credentials: 'include'
      });

      if (response.ok) {
        setJobs(prevJobs => prevJobs.filter(job => job.Workorder !== workorder));
        window.location.reload();
      } else {
        console.error('Error toggling currentJob:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling currentJob:', error);
    }
  };

  const handleExportAll = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobdata/export', {
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'all_job_data.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        console.log("Export successful");
      } else {
        console.error('Error exporting all job data:', response.statusText);
      }
    } catch (error) {
      console.error('Error exporting all job data:', error);
    }
  };

  const handleAddJob = () => {
    navigate('/addjob');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredJobs = jobs.filter(job =>
    job.Customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.Address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.Workorder.toString().includes(searchTerm) ||
    job.Property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1>Job Data</h1>
      <div className="d-flex justify-content-between mb-3">
        {isAdmin && (
          <button className="btn btn-success" onClick={handleAddJob}>
            Add Job
          </button>
        )}
        <button className="btn btn-primary" onClick={handleExportAll}>
          Export Jobs
        </button>
      </div>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Customer, Workorder, Property, or Address"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Workorder</th>
            <th>Customer</th>
            <th>Property</th>
            <th>Address</th> 
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map(job => (
            <tr key={job.Workorder}>
              <td>{job.Workorder}</td>
              <td>{job.Customer}</td>
              <td>{job.Property}</td>
              <td>{job.Address}</td>
              <td>
                {isAdmin && (
                  <>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(job.Workorder)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(job.Workorder)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewJobs;
