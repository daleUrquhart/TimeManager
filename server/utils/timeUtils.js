const { Op } = require('sequelize')
const { TimeData } = require('../db')

/**
 * Verifies if the new time entry overlaps with existing entries for the user.
 * 
 * @param {string} date - The date of the time entry.
 * @param {string} timein - The start time of the time entry.
 * @param {string} timeout - The end time of the time entry.
 * @param {number} id - The ID of the user.
 * @param {number|null} excludeId - An optional ID to exclude from the check (used during updates).
 * @returns {Promise<boolean>} - Returns true if there is an overlap, false otherwise.
 */
async function verifyTimeEntry(date, timein, timeout, id, excludeId = null) {
    try {
        const whereCondition = {
            id,  // Corrected property name from 'id' to 'id'
            date,
            [Op.or]: [
                {
                    timein: {
                        [Op.lt]: timeout
                    },
                    timeout: {
                        [Op.gt]: timein
                    }
                }
            ]
        }
        
        if (excludeId) {
            whereCondition.id = { [Op.ne]: excludeId }  // Corrected property name from 'entryid' to 'id'
        }

        console.log('whereCondition:', JSON.stringify(whereCondition))  // Debugging log

        const overlappingEntries = await TimeData.findAll({ where: whereCondition })

        console.log('overlappingEntries:', overlappingEntries.length)  // Debugging log

        return overlappingEntries.length > 0
    } catch (error) {
        console.error('Error verifying time entry overlap:', error)
        throw new Error('Verification failed')
    }
}

module.exports = {
    verifyTimeEntry
}
