const { Op } = require('sequelize');
const { TimeData } = require('../db'); 

/**
 * Verifies if the new time entry overlaps with existing entries for the user.
 * 
 * @param {string} date - The date of the time entry.
 * @param {string} timein - The start time of the time entry.
 * @param {string} timeout - The end time of the time entry.
 * @param {number} userId - The ID of the user.
 * @param {number|null} excludeId - An optional ID to exclude from the check (used during updates).
 * @returns {Promise<boolean>} - Returns true if there is an overlap, false otherwise.
 */
async function verifyTimeEntry(date, timein, timeout, userId, excludeId = null) {
    try { 
        const whereCondition = {
            id: userId,
            date: date,
            [Op.or]: [
                {
                    timein: {
                        [Op.between]: [timein, timeout]
                    }
                },
                {
                    timeout: {
                        [Op.between]: [timein, timeout]
                    }
                },
                {
                    [Op.and]: [
                        {
                            timein: {
                                [Op.lte]: timein
                            }
                        },
                        {
                            timeout: {
                                [Op.gte]: timeout
                            }
                        }
                    ]
                }
            ]
        };
 
        if (excludeId) {
            whereCondition.entryid = { [Op.ne]: excludeId };
        }

        const overlappingEntries = await TimeData.findAll({ where: whereCondition });
 
        return overlappingEntries.length > 0;
    } catch (error) {
        console.error('Error verifying time entry overlap:', error);
        throw new Error('Verification failed');
    }
}

module.exports = {
    verifyTimeEntry
};
