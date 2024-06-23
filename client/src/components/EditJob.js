import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditJob = () => {
  const { workorder } = useParams(); 
  const navigate = useNavigate(); 
  console.log("Job edit received workorder:", workorder);

  const [job, setJob] = useState({
    Workorder: '',
    Customer: '',
    Property: '',
    Address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobdata/${workorder}`, {
          credentials: 'include'  
        });
        if (response.ok) {
          const data = await response.json();
          setJob(data.jobData); 
        } else {
          console.error('Failed to fetch job');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);  
      }
    };

    fetchJob();
  }, [workorder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prevJob => ({
      ...prevJob,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/jobdata/edit/${workorder}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          Customer: job.Customer,
          Property: job.Property,
          Address: job.Address
        }),
        credentials: 'include' 
      });
      if (response.ok) {
        navigate('/viewjobs');  
      } else {
        console.error('Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;  
  }

  return (
    <div>
      <h2>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <label>Workorder: {job.Workorder}</label>  
        <br />

        <label>Customer:</label>
        <input type="text" name="Customer" value={job.Customer} onChange={handleChange} required />
        <br />

        <label>Property:</label>
        <input type="text" name="Property" value={job.Property} onChange={handleChange} required />
        <br />

        <label>Address:</label>
        <input type="text" name="Address" value={job.Address} onChange={handleChange} required />
        <br />

        <button type="submit">Update Job</button>
      </form>
    </div>
  );
};

export default EditJob;
