const Sequelize = require('sequelize');
const JobDataModel = require('./models/JobData');
const TimeDataModel = require('./models/TimeData');
const EmployeeModel = require('./models/Employee');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

const JobData = JobDataModel(sequelize, Sequelize);
const TimeData = TimeDataModel(sequelize, Sequelize);
const Employee = EmployeeModel(sequelize, Sequelize);

Employee.hasMany(TimeData, { foreignKey: 'id' });
TimeData.belongsTo(Employee, { foreignKey: 'id' });

JobData.hasMany(TimeData, { foreignKey: 'workorder' });
TimeData.belongsTo(JobData, { foreignKey: 'workorder' });

module.exports = {
    sequelize,
    JobData,
    TimeData,
    Employee
};
