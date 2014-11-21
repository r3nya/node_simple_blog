var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var VKONTAKTE_APP_ID = '4642688';
var VKONTAKTE_APP_SECRET = 'qWooDqcS6PMdCecztxy4';
var domain = 'localhost:3000';

if (VKONTAKTE_APP_ID === null || VKONTAKTE_APP_SECRET === null) {
    console.error('please set VKONTAKTE_APP_ID and VKONTAKTE_APP_SECRET');
    process.exit(0);
}

passport.use(new VKontakteStrategy({
        clientID:     VKONTAKTE_APP_ID,
        clientSecret: VKONTAKTE_APP_SECRET,
        callbackURL:  "http://" + domain + "/auth/vk/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ vkontakteId: profile.id }, {
            username: profile.displayName,
            email: profile.id + '@example.com',
            password: Math.random() + 'test'
        }, function (err, user) {
            return done(err, user);
        });
    }
));

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user || !user.comparePassword(password)) {
                return done(null, false, {message: 'Пользователь с такими данными не найден'});
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = passport;