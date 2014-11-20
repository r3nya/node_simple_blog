module.exports = function (passport) {
    var express  = require('express');
    var router  = express.Router();
    var User = require('../models/user');

    router.use(function (req, res, next) {
        if (typeof req.user !== 'object') {
            req.user = null;
        }
        res.locals.user = req.user;
        res.locals.authenticated = req.user !== null;
        next(null);
    });

    router
        .get('/login', function (req, res) {
            res.render('login', {
                errors: req.flash('error'),
                success: req.flash('success'),
                user: req.user
            });
        });

    router
        .post('/login', passport.authenticate('local', {
            badRequestMessage: 'Введите данные для входа',
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        }));

    router
        .get('/logout', function (req, res) {
            req.logout();
            res.redirect('/');
        });

    router.route('/signup')
        .all(function (req, res, next) {
            if (req.user !== null) {
                res.redirect('/');
            } else {
                next();
            }
        })
        .get(function (req, res) {
            res.render('signup', {
                errors: req.flash('error'),
                user: req.user
            });
        })
        .post(function (req, res) {
            var user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });

            user.save(function (err) {
                if (err !== null) {
                    var errors = [];
                    Object.keys(err.errors).forEach(function (field) {
                        errors.push(err.errors[field].message);
                    });
                    req.flash('error', errors);
                    res.redirect('/signup');
                } else {
                    req.flash('success', 1);
                    res.redirect('/');
                }
                console.log(err);

            });
        });

    router
        .get('/auth/vk', passport.authenticate('vkontakte'),
        function(req, res){
            // The request will be redirected to vk.com for authentication, so
            // this function will not be called.
        });

    router
        .get('/auth/vk/callback', passport.authenticate('vkontakte', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    return router;
};