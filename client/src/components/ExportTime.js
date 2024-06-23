import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from './AuthContext';

const ExportTime = () => {
  const { isAdmin, user } = useAuth();  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchId, setSearchId] = useState('');
  const [employeeIds, setEmployeeIds] = useState([]);

  useEffect(() => { 
    fetchEmployeeIds();
  }, []);

  const fetchEmployeeIds = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/employee');
        if (!response.ok) {
            throw new Error('Failed to fetch employee IDs');
        }
        const data = await response.json();
        const employeeIdNumbers = data.employees.map(emp => emp.id.toString());
        setEmployeeIds(employeeIdNumbers);
    } catch (error) {
        console.error('Error fetching employee IDs:', error);
    }
  };

  const handleExport = async () => {
    let url = 'http://localhost:5000/api/time/export';
  
    if (searchId != '' && !employeeIds.includes(searchId)) {
      alert('Invalid employee ID'); 
      return;
    } 

    if (startDate === '') {
      setStartDate(user.datestarted);
    }
  
    if (endDate === '') {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;
  
      setEndDate(currentDate);
    }

    if (isAdmin && searchId !== '' && isNaN(parseInt(searchId))) {
      alert('Invalid search ID. Please enter a valid numeric ID.');
      return;
    }

    // Construct the export URL
    url += `?start=${startDate}&end=${endDate}&id=${searchId}`;
  
    try {
      const response = await fetch(url, {
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch time entries');
      }
  
      const data = await response.json();
      if (!data.timeEntries || data.timeEntries.length === 0) {
        console.error('No time entries found for the specified date range');
        return;
      }
  
      // Create a PDF document
      const doc = new jsPDF();
      doc.text('Time Entry Report', 14, 16);
  
      // Prepare the data for PDF table
      const tableData = data.timeEntries.map(entry => [
        entry.id,
        entry.date,
        entry.role,
        entry.timein,
        entry.workorder,
        entry.subaccount,
        entry.activity,
        entry.timeout
      ]);
  
      doc.autoTable({
        head: [['ID', 'Date', 'Role', 'Time In', 'Workorder', 'Subaccount', 'Activity', 'Time Out']],
        body: tableData
      });
  
      // Save the PDF
      const filename = `time_entries_${searchId || 'all'}_${endDate || 'current'}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Error exporting time entries:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Export Time Entries</h1>
      <div className="form-group">
        <label>Start Date</label>
        <input
          type="date"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>End Date</label>
        <input
          type="date"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      {isAdmin && (
        <div className="form-group">
          <label>Search by ID</label>
          <input
            type="text"
            className="form-control"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
      )}
      <button onClick={handleExport} className="btn btn-primary">
        Export to PDF
      </button>
    </div>
  );
};

export default ExportTime;
