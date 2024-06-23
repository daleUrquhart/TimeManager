import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditTime = () => {
  const { entryid } = useParams();  
  console.log("Edit time recived entryid: "+entryid)
  const navigate = useNavigate();  

  const [timeEntry, setTimeEntry] = useState({ 
    date: '',
    role: '',
    timein: '',
    workorder: '',
    subaccount: '',
    activity: '',
    timeout: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeEntry = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/time/${entryid}`, {
          credentials: 'include'  
        });
        if (response.ok) {
          const data = await response.json();
          setTimeEntry(data.timeEntry);  
        } else {
          console.error('Failed to fetch time entry');
        }
      } catch (error) {
        console.error('Error fetching time entry:', error);
      } finally {
        setLoading(false);  
      }
    };

    fetchTimeEntry();
  }, [entryid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimeEntry({
      ...timeEntry,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/time/${entryid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(timeEntry),
        credentials: 'include' 
      });
      if (response.ok) {
        navigate('/viewtime'); 
      } else {
        console.error('Failed to update time entry');
      }
    } catch (error) {
      console.error('Error updating time entry:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!timeEntry) {
    return <div>Time entry not found</div>;  
  }

  return (
    <div>
      <h2>Edit Time Entry</h2>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="text" name="date" value={timeEntry.date} onChange={handleChange} required />
        <br />

        <label>Role:</label>
        <input type="text" name="role" value={timeEntry.role} onChange={handleChange} required />
        <br />

        <label>Time In:</label>
        <input type="text" name="timein" value={timeEntry.timein} onChange={handleChange} required />
        <br />

        <label>Workorder:</label>
        <input type="text" name="workorder" value={timeEntry.workorder} onChange={handleChange} required />
        <br />

        <label>Subaccount:</label>
        <input type="text" name="subaccount" value={timeEntry.subaccount} onChange={handleChange} required />
        <br />

        <label>Activity:</label>
        <input type="text" name="activity" value={timeEntry.activity} onChange={handleChange} required />
        <br />

        <label>Time Out:</label>
        <input type="text" name="timeout" value={timeEntry.timeout} onChange={handleChange} required />
        <br />

        <button type="submit">Update Time Entry</button>
      </form>
    </div>
  );
};

export default EditTime;
