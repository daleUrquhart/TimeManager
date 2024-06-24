const Sequelize = require('sequelize');
require('dotenv').config();
 
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, 
});
 
// Test the database connection
async function testConnection() {
    try {
    await sequelize.authenticate()
    console.log('Connection to the database has been established successfully.')
    } catch (error) {
    console.error('Unable to connect to the database:', error)
    }
}

testConnection()

// Define models
const JobData = require('./models/JobData')(sequelize, Sequelize);
const TimeData = require('./models/TimeData')(sequelize, Sequelize);
const Employee = require('./models/Employee')(sequelize, Sequelize);
 
// Define associations
Employee.hasMany(TimeData, { foreignKey: 'id' });
TimeData.belongsTo(Employee, { foreignKey: 'id' });
 
module.exports = {
    sequelize,
    JobData,
    TimeData,
    Employee
};
