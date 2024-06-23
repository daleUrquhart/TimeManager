const express = require('express')
const timeRoutes = require('./timeRoutes')
const jobdataRoutes = require('./jobdataRoutes')
const employeeRoutes = require('./employeeRoutes')
const authRoutes = require('./authRoutes')

const router = express.Router()

router.use('/time', timeRoutes)
router.use('/jobdata', jobdataRoutes)
router.use('/employee', employeeRoutes)
router.use('/auth', authRoutes)

module.exports = router
