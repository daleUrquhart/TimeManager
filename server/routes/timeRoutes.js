const express = require('express')
const router = express.Router()
const { TimeData } = require('../db') 
const { Op } = require('sequelize')
const { verifyTimeEntry } = require('../utils/timeUtils')
const { ensureAuthenticated, ensureAdmin } = require('../middleware/middlewares');
 
router.post('/', async (req, res) => {
    const { date, role, timein, workorder, subaccount, activity, timeout, employeeId } = req.body
    let userId = req.session.user.id 

    try { 
        if (req.session.user.access === 0 && employeeId) {
            userId = employeeId  
        }

        const overlap = await verifyTimeEntry(date, timein, timeout, userId)

        if (overlap) {
            return res.status(400).json({ message: 'Time entry overlaps with existing entry' })
        }
 
        const newTimeEntry = await TimeData.create({
            id: userId,
            date,
            role,
            timein,
            workorder,
            subaccount,
            activity,
            timeout
        })

        res.json({ message: 'Time entry added successfully', timeEntry: newTimeEntry })
    } catch (error) {
        console.error('Error adding time entry:', error)
        res.status(500).json({ message: 'Error adding time entry' })
    }
})
 
router.put('/:entryid', async (req, res) => {
    const entryid = parseInt(req.params.entryid)
    const { date, role, timein, workorder, subaccount, activity, timeout } = req.body
    console.log("Editing time for:", entryid)

    if (isNaN(entryid)) {
        return res.status(400).json({ message: 'Invalid entry ID' })
    }

    try {
        const timeEntry = await TimeData.findOne({ where: { entryid } })

        if (!timeEntry) {
            return res.status(404).json({ message: 'Time entry not found' })
        }

        const overlap = await verifyTimeEntry(date, timein, timeout, timeEntry.id, entryid)

        if (overlap) {
            return res.status(400).json({ message: 'Time entry overlaps with existing entry' })
        }

        await TimeData.update({
            date,
            role,
            timein,
            workorder,
            subaccount,
            activity,
            timeout
        }, { where: { entryid } })

        res.json({ message: 'Time entry updated successfully' })
    } catch (error) {
        console.error('Error updating time entry:', error)
        res.status(500).json({ message: 'Error updating time entry' })
    }
})
 
router.delete('/:entryid', async (req, res) => {
    const entryid = parseInt(req.params.entryid)

    if (isNaN(entryid)) {
        return res.status(400).json({ message: 'Invalid entry ID' })
    }

    try {
        const timeEntry = await TimeData.findOne({ where: { entryid } })

        if (!timeEntry) {
            return res.status(404).json({ message: 'Time entry not found' })
        }

        await TimeData.destroy({ where: { entryid } })

        res.json({ message: 'Time entry deleted successfully' })
    } catch (error) {
        console.error('Error deleting time entry:', error)
        res.status(500).json({ message: 'Error deleting time entry' })
    }
})
 
router.get('/', ensureAuthenticated, async (req, res) => { 
    const id = req.session.user.id;  

    try {
    let queryOptions = { where: { id } }; 

    const timeEntries = await TimeData.findAll(queryOptions);

    if (timeEntries.length === 0) {
        return res.status(404).json({ message: 'No time entries found' });
    }

    res.json({ timeEntries });
    } catch (error) {
    console.error('Error fetching time entries:', error);
    res.status(500).json({ message: 'Error fetching time entries' });
    }
});

   
router.get('/search/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    const { id } = req.params; 

    try {
    let queryOptions = { where: { id: parseInt(id) } };

    const timeEntries = await TimeData.findAll(queryOptions);

    if (!timeEntries) {
        return res.status(404).json({ message: 'Time entry not found' });
    } 
    res.json({ timeEntries });
    } catch (error) {
    console.error('Error fetching time entry:', error);
    res.status(500).json({ message: 'Error fetching time entry' });
    }
  });
  
  
 
router.get('/export', async (req, res) => {
    const { start, end, id } = req.query;
    const userId = id || req.session.user.id;
    console.log(req.query)
    try {
        if (!start || !end) {
            return res.status(400).json({ message: 'Start and end dates are required' });
        }

        const whereClause = {
            date: {
                [Op.between]: [start, end]
            }
        };

        if (userId) {
            whereClause.id = userId;
        }

        const timeEntries = await TimeData.findAll({
            where: whereClause
        });

        if (timeEntries.length === 0) {
            return res.status(404).json({ message: 'No time entries found for the specified date range' });
        }

        res.json({ timeEntries });
    } catch (error) {
        console.error('Error exporting time entries:', error);
        res.status(500).json({ message: 'Error exporting time entries' });
    }
});


module.exports = router
