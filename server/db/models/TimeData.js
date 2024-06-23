const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TimeData = sequelize.define('TimeData', {
        entryid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        id: {
            type: DataTypes.INTEGER,  // Changed from STRING to INTEGER
            allowNull: false,
            references: {
                model: 'employees',
                key: 'id'
            }
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM,
            values: ['equipment', 'laborer', 'mechanic', 'payment'],
            allowNull: false
        },
        timein: {
            type: DataTypes.TIME,
            allowNull: false
        },
        workorder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'jobdata',
                key: 'id'
            }
        },
        subaccount: {
            type: DataTypes.ENUM,
            values: ['10100', '01'],
            allowNull: false
        },
        activity: {
            type: DataTypes.ENUM,
            values: [
                'carpenter', 'clerk', 'foreman', 'laborer', 'lead-hand', 
                'mechanic', 'patter-man', 'superintendent', 'surveyor', 'welder', 
                'painter', 'foreman with truck', 'laborer with truck', 'lead hand with truck', 
                'mechanic with truck', 'superintendent with truck', 'welder with truck', 
                'operator only', 'driller', 'standby', 'travel', 'non-billable labor', 
                'equipment repair'
            ],
            allowNull: false
        },
        timeout: {
            type: DataTypes.TIME,
            allowNull: false
        }
    }, {
        tableName: 'timedata',
        timestamps: false
    });

    return TimeData;
};
