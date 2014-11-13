var passport = require('passport');
var DigestStrategy = require('passport-http').DigestStrategy;
var accounts = {
        'dredd': {
            id: 0,
            name: 'Joseph Dredd',
            email: 'law@mega-city1.com',
            password: 'iamthelaw'
        }
    };

passport.use(new DigestStrategy({ qop: 'auth' },
    function (username, done) {
        var user = accounts[username];
        if (typeof user === 'object') {
            return done(null, user, user.password);
        } else {
            return done(null, false);
        }
    },
    function(params, done) {
        done(null, true)
    }
));


module.exports = [
    passport.initialize(),
    passport.authenticate('digest', {session: false})
];
