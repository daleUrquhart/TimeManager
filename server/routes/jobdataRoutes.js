const express = require('express')
const router = express.Router()
const { JobData } = require('../db')  
  
router.post('/add', async (req, res) => {
    try {
        const { workorder, customer, property, address } = req.body
 
        if (!workorder || !customer || !property || !address) {
            return res.status(400).json({ error: 'Missing required fields' })
        }
 
        const newJob = await JobData.create({
            Workorder: workorder,
            Customer: customer,
            Property: property,
            Address: address
        })

        res.status(201).json({ message: 'Job added successfully', job: newJob })
    } catch (error) {
        console.error('Error adding job:', error)
        res.status(500).json({ error: 'Failed to add job' })
    }
})
 
router.put('/edit/:workorder', async (req, res) => {
    const workorder = parseInt(req.params.workorder, 10)
    const { Customer, Property, Address } = req.body
  
    if (isNaN(workorder)) {
        return res.status(400).json({ error: 'Invalid workorder' })
    }

    try { 
        if (!Customer || !Property || !Address) {
            return res.status(400).json({ error: 'Missing required fields' })
        }
 
        const jobToUpdate = await JobData.findOne({ where: { Workorder: workorder } })

        if (!jobToUpdate) {
            return res.status(404).json({ error: 'Job not found' })
        }
 
        jobToUpdate.Customer = Customer
        jobToUpdate.Property = Property
        jobToUpdate.Address = Address
 
        await jobToUpdate.save()

        res.json({ message: 'Job updated successfully', job: jobToUpdate })
    } catch (error) {
        console.error('Error updating job:', error)
        res.status(500).json({ error: 'Failed to update job' })
    }
})
 
router.put('/delete/:workorder', async (req, res) => {
    const workorder = parseInt(req.params.workorder, 10)
    console.log("Soft deleting job with workorder:", workorder)

    if (isNaN(workorder)) {
        return res.status(400).json({ error: 'Invalid workorder' })
    }

    try { 
        const jobToDelete = await JobData.findOne({ where: { Workorder: workorder } })

        if (!jobToDelete) {
            return res.status(404).json({ message: 'Job not found' })
        }
 
        jobToDelete.CurrentJob = false
        await jobToDelete.save()

        res.json({ message: 'Job visibility updated successfully' })
    } catch (error) {
        console.error('Error updating job visibility:', error)
        res.status(500).json({ message: 'Error updating job visibility' })
    }
})
 
router.get('/export', async (req, res) => {
    try { 
        const jobs = await JobData.findAll()

        if (jobs.length > 0) { 
            let csvData = 'Workorder,Customer,Property,Address\n'
            jobs.forEach(job => {
                csvData += `${job.Workorder},${job.Customer},${job.Property},${job.Address}\n`
            })
 
            res.setHeader('Content-Type', 'text/csv')
            res.setHeader('Content-Disposition', 'attachment filename="all_job_data.csv"')
            res.send(csvData)
        } else {
            res.status(404).json({ message: 'No jobs found' })
        }
    } catch (error) {
        console.error('Error exporting job data:', error)
        res.status(500).json({ error: 'Failed to export job data' })
    }
})
 
router.get('/', async (req, res) => {
    try {
        const jobData = await JobData.findAll({
            where: {
                CurrentJob: true
            }
        })
        res.status(200).json({ success: true, jobData })
        console.log("Job data fetched succesfully, "+jobData.length+" entries")
    } catch (error) {
        console.error('Error fetching job data:', error)
        res.status(500).json({ message: 'Error fetching job data' })
    }
})
 
router.get('/:workorder', async (req, res) => {
    const workorder = parseInt(req.params.workorder, 10)

    if (isNaN(workorder)) {
        return res.status(400).json({ message: 'Invalid Workorder' })
    }

    try {
        const jobData = await JobData.findOne({ 
            where: { 
                Workorder: workorder,
                CurrentJob: true 
            } 
        })

        if (!jobData) {
            return res.status(404).json({ message: 'Job not found' })
        }

        res.status(200).json({ success: true, jobData })
    } catch (error) {
        console.error('Error fetching job by Workorder:', error)
        res.status(500).json({ message: 'Error fetching job by Workorder' })
    }
})

module.exports = router
