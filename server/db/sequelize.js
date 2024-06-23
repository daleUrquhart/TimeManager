const Sequelize = require('sequelize');
require('dotenv').config();
 
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, 
});
 
const JobData = require('./models/JobData')(sequelize, Sequelize);
const TimeData = require('./models/TimeData')(sequelize, Sequelize);
const Employee = require('./models/Employee')(sequelize, Sequelize);
 
Employee.hasMany(TimeData, { foreignKey: 'id' });
TimeData.belongsTo(Employee, { foreignKey: 'id' });
 
module.exports = {
    sequelize,
    JobData,
    TimeData,
    Employee
};
