const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const PDFDocument = require('pdfkit');
const { Employee } = require('../db');

// Change Password
router.post('/changepassword', async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;

  if (!id || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const employee = await Employee.findOne({ where: { id } });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const match = await bcrypt.compare(currentPassword, employee.password);

    if (!match) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Employee.update({ password: hashedPassword }, { where: { id } });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
});

// Export Employee Data
router.get('/export', async (req, res) => {
  try {
    const employees = await Employee.findAll({ where: { currentemployee: true } });

    if (employees.length > 0) {
      const doc = new PDFDocument();
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="all_employees.pdf"');
        res.send(pdfData);
      });

      doc.fontSize(12).text('Employees List', { align: 'center' });
      doc.moveDown();
      employees.forEach((employee) => {
        doc.fontSize(10).text(`ID: ${employee.id}`);
        doc.text(`Name: ${employee.name}`);
        doc.text(`Address: ${employee.address}`);
        doc.text(`Phone Number: ${employee.phonenumber}`);
        doc.text(`Email: ${employee.email}`);
        doc.text(`Date Started: ${employee.datestarted}`);
        doc.text(`Access: ${employee.access}`);
        doc.text('--------------------------------------------');
      });

      doc.end();
    } else {
      res.status(404).json({ message: 'No employees found' });
    }
  } catch (error) {
    console.error('Error exporting employee data:', error);
    res.status(500).json({ error: 'Failed to export employee data' });
  }
});

// Add Employee
router.post('/add', async (req, res) => {
  const { id, name, address, phonenumber, email, datestarted, password, access } = req.body;

  if (!id || !name || !address || !phonenumber || !email || !datestarted || !password || !access) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await Employee.create({
      id,
      name,
      address,
      phonenumber,
      email,
      datestarted,
      password: hashedPassword,
      access,
      currentemployee: true
    });

    res.status(200).json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'An error occurred while adding the employee' });
  }
});

// Get Employee Data
router.get('/', async (req, res) => {
    try {
      const employees = await Employee.findAll({ where: { currentemployee: true } });
      res.json({ employees });
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: 'An error occurred while fetching employees' });
    }
});

// Get Employee By ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ where: { id: req.params.id, currentemployee: true } });
    if (employee) {
      res.json({ employee });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'An error occurred while fetching the employee' });
  }
});

// Update Employee
router.put('/:id', async (req, res) => {
  const { name, address, phonenumber, email, datestarted, access } = req.body; 

  try {
    const updated = await Employee.update(
      { name, address, phonenumber, email, datestarted, access },
      { where: { id: req.params.id } }
    );

    if (updated[0] === 1) {
      res.json({ message: 'Employee updated successfully' });
    } else {
      res.status(201).json({ message: 'No changes made' });
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'An error occurred while updating the employee' });
  }
});

// Soft Delete Employee
router.delete('/delete/:id', async (req, res) => {
  try {
    const updated = await Employee.update(
      { currentemployee: false },
      { where: { id: req.params.id } }
    );

    if (updated[0] === 1) {
      res.json({ message: 'Employee deleted successfully' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'An error occurred while deleting the employee' });
  }
});

module.exports = router;
