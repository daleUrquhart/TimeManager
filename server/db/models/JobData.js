const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const JobData = sequelize.define('JobData', {
        Workorder: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'workorder'
        },
        Customer: {
            type: DataTypes.STRING,
            field: 'customer'
        },
        Property: {
            type: DataTypes.STRING,
            field: 'property'
        },
        Address: {
            type: DataTypes.STRING,
            field: 'address'
        },
        CurrentJob: {
            type: DataTypes.BOOLEAN,
            field: 'currentjob',
            defaultValue: true
        }
    }, {
        tableName: 'jobdata',
        timestamps: false
    });

    return JobData;
};
