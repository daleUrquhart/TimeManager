import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AddTime = () => {
    const { isAdmin } = useAuth();
    const [formData, setFormData] = useState({
        date: '',
        role: '',
        timein: '',
        workorder: '',
        subaccount: '',
        activity: '',
        timeout: ''
    });
    const [workorderError, setWorkorderError] = useState('');
    const [workorders, setWorkorders] = useState([]);
    const [employeeIdError, setEmployeeIdError] = useState('');
    const [employeeIds, setEmployeeIds] = useState([]);

    useEffect(() => {
        fetchWorkorders();
        fetchEmployeeIds();
    }, []);

    const fetchWorkorders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/jobdata');
            if (!response.ok) {
                throw new Error('Failed to fetch workorders');
            }
            const data = await response.json();
            const workorderNumbers = data.jobData.map(job => job.Workorder);
            setWorkorders(workorderNumbers);
            console.log(workorderNumbers);
        } catch (error) {
            console.error('Error fetching workorders:', error);
        }
    };

    const fetchEmployeeIds = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employee');
            if (!response.ok) {
                throw new Error('Failed to fetch employee IDs');
            }
            const data = await response.json();
            const employeeIdNumbers = data.employees.map(emp => emp.id.toString());
            setEmployeeIds(employeeIdNumbers);
            console.log(employeeIdNumbers);
        } catch (error) {
            console.error('Error fetching employee IDs:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
 
        if (name === 'workorder') {
            setWorkorderError('');
        }
        if (name === 'employeeId') {
            setEmployeeIdError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate workorder
        console.log(parseInt(formData.workorder))
        if (!workorders.includes(parseInt(formData.workorder))) {
            setWorkorderError('Invalid workorder number');
            alert('Entry was not saved. Please correct the workorder number.');
            return;
        } else setWorkorderError('')

        // Validate employeeId
        if (!employeeIds.includes(formData.employeeId)) {
            setEmployeeIdError('Invalid employee ID');
            alert('Entry was not saved. Please correct the employee ID.');
            return;
        } else setEmployeeIdError('')

        fetch('http://localhost:5000/api/time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                alert(data.message)

            })
            .catch(error => console.error('Error adding time entry:', error));
    };

    return (
        <div className="container mt-5">
            <h1>Add Time Entry</h1>
            <form onSubmit={handleSubmit}>
                {isAdmin && (
                    <div className="form-group">
                        <label>Employee ID</label>
                        <input
                            type="text"
                            className="form-control"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleChange}
                            required
                        />
                        {employeeIdError && (
                            <small className="text-danger">{employeeIdError}</small>
                        )}
                    </div>
                )}
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select
                        className="form-control"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select role</option>
                        <option value="equipment">Equipment</option>
                        <option value="laborer">Laborer</option>
                        <option value="mechanic">Mechanic</option>
                        <option value="payment">Payment</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Time In</label>
                    <input
                        type="time"
                        className="form-control"
                        name="timein"
                        value={formData.timein}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Workorder</label>
                    <input
                        type="text"
                        className="form-control"
                        name="workorder"
                        value={formData.workorder}
                        onChange={handleChange}
                        required
                    /> 
                    {workorderError && (
                        <small className="text-danger">{workorderError}</small>
                    )}
                </div>
                <div className="form-group">
                    <label>Subaccount</label>
                    <select
                        className="form-control"
                        name="subaccount"
                        value={formData.subaccount}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select subaccount</option>
                        <option value="10100">10100</option>
                        <option value="01">01</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Activity</label>
                    <select
                        className="form-control"
                        name="activity"
                        value={formData.activity}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select activity</option>
                        <option value="carpenter">Carpenter</option>
                        <option value="clerk">Clerk</option>
                        <option value="foreman">Foreman</option>
                        <option value="laborer">Laborer</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Time Out</label>
                    <input
                        type="time"
                        className="form-control"
                        name="timeout"
                        value={formData.timeout}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Entry</button>
            </form>
        </div>
    );
};

export default AddTime;
