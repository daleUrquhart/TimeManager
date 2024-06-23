const express = require('express')
const router = express.Router()
const { Employee } = require('../db') 
const bcrypt = require('bcrypt')

router.post('/signin', async (req, res) => {
    const { id, password } = req.body;
    console.log('Received signin request with', { id, password });

    if (!id || !password) {
        console.log('Missing employee number or password');
        return res.status(400).json({ message: 'Employee number and password are required' });
    }

    try {
        const employee = await Employee.findOne({ where: { id } });

        if (!employee) {
            console.log('Employee not found for id:', id);
            return res.status(401).json({ message: 'Invalid employee number or password' });
        }

        const match = await bcrypt.compare(password, employee.password);

        if (!match) {
            console.log('Password does not match for employee id:', id);
            return res.status(401).json({ message: 'Invalid employee number or password' });
        }

        const user = {
            id: employee.id,
            name: employee.name,
            access: employee.access,
            datestarted: employee.datestarted
        };

        req.session.logged_in = true;
        req.session.user = user;

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: 'Session save error' });
            }
            console.log("Signin successful", user.id, user.access);
            res.json({ message: 'Signin successful', user });
        });

    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ message: 'An error occurred while signing in' });
    }
});

 
router.post('/signout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error logging out' })
            }
            res.clearCookie('connect.sid') 
            res.json({ message: 'Logged out successfully' })
        })
    } else {
        res.status(401).json({ message: 'Not logged in' })
    }
})
 
router.get('/auth', (req, res) => { 
    if (req.session.logged_in && req.session.user) { 
        res.json({ isAuthenticated: true, access: req.session.user.access, id: req.session.user.id, user:req.session.user })
    } else { 
        res.json({ isAuthenticated: false })
    }
})

module.exports = router
