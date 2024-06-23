const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.174.1:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204 
};

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
    corsOptions,
    logSession,
    ensureAuthenticated,
    ensureAdmin
};
