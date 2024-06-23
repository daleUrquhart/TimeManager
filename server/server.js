const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { sessionConfig } = require('./session'); 
const { corsOptions, logSession } = require('./middleware/middlewares'); 
const routes = require('./routes');
const { sequelize } = require('./db');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(session(sessionConfig));
//app.use(logSession);

// Routes
app.use('/api', routes); 

// Start server
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Test and synchronize database
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');
 
        await sequelize.sync({ force: false });  
        console.log('Database synchronized with models');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app; 