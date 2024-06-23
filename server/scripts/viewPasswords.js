const { Sequelize, DataTypes } = require('sequelize');
const crypto = require('crypto');
require('dotenv').config();
 
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});
 
const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  phonenumber: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  datestarted: {
    type: DataTypes.DATE,
  },
  password: {
    type: DataTypes.STRING,
  },
  access: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'Employees',
  timestamps: false,
});
 
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

function decrypt(text) {
  try {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

const showUserPasswords = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const employees = await Employee.findAll({
      attributes: ['id', 'password'],
    });

    employees.forEach(employee => {
      const decryptedPassword = decrypt(employee.password);
      if (decryptedPassword) {
        console.log(`ID: ${employee.id}, Password: ${decryptedPassword}`);
      } else {
        console.log(`ID: ${employee.id}, Password: Decryption failed`);
      }
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
};

showUserPasswords();
