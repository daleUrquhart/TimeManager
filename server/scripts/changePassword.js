const { Employee } = require('../models/Employee');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
 
dotenv.config();
 
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});
 
const EmployeeModel = require('../models/Employee')(sequelize);

const updatePassword = async (id, newPassword) => {
  try { 
    const employee = await EmployeeModel.findOne({ where: { id } });

    if (!employee) {
      throw new Error('Employee not found');
    }
 
    const hashedPassword = await bcrypt.hash(newPassword, 10); 
 
    await EmployeeModel.update({ password: hashedPassword }, { where: { id } });

    console.log('Password updated successfully');
  } catch (error) {
    console.error('Failed to update password:', error.message);
  } finally {
    await sequelize.close();
  }
};
 
const [, , id, newPassword] = process.argv;
if (!id || !newPassword) {
  console.error('Please provide employeeId and newPassword as command line arguments.');
  process.exit(1);
}

updatePassword(id, newPassword);
