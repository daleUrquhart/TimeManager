const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const Employee = sequelize.define('Employee', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'id'
        },
        name: {
            type: Sequelize.STRING,
            field: 'name'
        },
        address: {
            type: Sequelize.STRING,
            field: 'address'
        },
        phonenumber: {
            type: Sequelize.STRING,
            field: 'phonenumber'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email'
        },
        datestarted: {
            type: Sequelize.DATEONLY,
            field: 'datestarted'
        },
        password: {
            type: Sequelize.STRING,
            field: 'password'
        },
        access: {
            type: Sequelize.INTEGER,
            field: 'access'
        },
        currentemployee: { 
            type: Sequelize.BOOLEAN,
            field: 'currentemployee',
            defaultValue: true 
        }
    }, {
        tableName: 'employees',
        timestamps: false  
    });

    Employee.beforeCreate(async (employee) => {
        if (employee.password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(employee.password, saltRounds);
            employee.password = hashedPassword;
        }
    });

    return Employee;
};
