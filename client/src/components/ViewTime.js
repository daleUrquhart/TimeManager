import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ViewTime = () => { 
  const { isAdmin } = useAuth();  
  const [timeEntries, setTimeEntries] = useState([]);
  const [searchID, setSearchID] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimeEntries();  
  }, []);

  const fetchTimeEntries = async () => {
    try {
      const url = searchID ? `http://localhost:5000/api/time/search/${searchID}` : 'http://localhost:5000/api/time';
      const response = await fetch(url, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.timeEntries)) {
          const sortedEntries = data.timeEntries.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;

            const timeinA = new Date(`${a.date}T${a.timein}`);
            const timeinB = new Date(`${b.date}T${b.timein}`);
            return timeinA - timeinB;
          });

          setTimeEntries(sortedEntries);
        } else {
          setTimeEntries([]);
        }
        console.log(data.timeEntries); 
      } else if (response.status === 404) {
        console.error('Time entry not found');
        setTimeEntries([]);
      } else {
        throw new Error('Failed to fetch time entries');
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
      setTimeEntries([]);
    }
  };

  const handleSearch = async () => {
    await fetchTimeEntries(); 
  };

  const handleEdit = (entryid) => {
    navigate(`/edittime/${entryid}`);
  };

  const handleDelete = async (entryid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/time/${entryid}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setTimeEntries(prevEntries => prevEntries.filter(entry => entry.entryid !== entryid));
      } else {
        console.error('Error deleting time entry:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting time entry:', error);
    }
  };

  const handleAddTime = () => {
    navigate('/addtime'); 
  };

  const handleExportTime = () => {
    navigate('/exporttime');
    console.log('Exporting time entries...');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h1>Time Entries</h1>
        <div> 
          <button className="btn btn-success me-2" onClick={handleAddTime}>Add Time</button> 
          <button className="btn btn-info" onClick={handleExportTime}>Export Time</button>
        </div>
      </div>
      {isAdmin && (
        <div className="mb-3">
          <label htmlFor="searchID" className="form-label">Search by ID:</label>
          <div className="input-group">
            <input
              type="text"
              id="searchID"
              className="form-control"
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          </div>
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Role</th>
            <th>Time In</th>
            <th>Workorder</th>
            <th>Subaccount</th>
            <th>Activity</th>
            <th>Time Out</th> 
          </tr>
        </thead>
        <tbody>
          {timeEntries.length > 0 ? (
            timeEntries.map(entry => (
              <tr key={entry.entryid}>
                <td>{entry.id}</td>
                <td>{entry.date}</td>
                <td>{entry.role}</td>
                <td>{entry.timein}</td>
                <td>{entry.workorder}</td>
                <td>{entry.subaccount}</td>
                <td>{entry.activity}</td>
                <td>{entry.timeout}</td>
                {isAdmin && (
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(entry.entryid)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(entry.entryid)}>Delete</button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">No time entries found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTime;
