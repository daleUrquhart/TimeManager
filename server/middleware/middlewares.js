const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('../db');

const store = new SequelizeStore({
    db: sequelize
});

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        path: '/',
        domain: process.env.DOMAIN || 'localhost'
    },
    resave: false,
    saveUninitialized: false,
    store: store
};

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://192.168.174.1:3000',
        'https://time-manager-nine.vercel.app',
        'https://urquhartproductions.ca'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    ]
};

// Thorough logs for debugging
const logSession = (req, res, next) => {
    if (req.session && req.session.user) {
        console.log('User ID:', req.session.user.id, 'Access Level:', req.session.user.access);
    } else {
        console.log('No active session');
    }
    next();
};

const ensureAuthenticated = (req, res, next) => {
    if (req.session.logged_in) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

const ensureAdmin = (req, res, next) => {
    if (req.session.logged_in && req.session.user.access === 0) {
        return next();
    }
    res.status(403).json({ message: 'Forbidden' });
};

module.exports = {
    sessionConfig,
    corsOptions,
    logSession,
    ensureAuthenticated,
    ensureAdmin
};
