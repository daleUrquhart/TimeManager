const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const { sequelize } = require('./db')

const store = new SequelizeStore({
    db: sequelize
})

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, 
        secure: false, 
        httpOnly: true,
        path: '/',
        domain: process.env.DOMAIN || 'localhost'
    },
    resave: false,
    saveUninitialized: true,
    store: store
}

module.exports = {
    session,
    store,
    sessionConfig
}
