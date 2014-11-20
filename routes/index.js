var express  = require('express'),
    mongoose = require('mongoose');

var router  = express.Router();

var Post    = require('../models/post'),
    User    = require('../models/user'),
    Comment = require('../models/comment');

/* GET home page. */
router.get('/', function (req, res) {
    if (req.user === null) {
        res.redirect('/login');
    } else {
        Post.find().exec(function (err, data) {
            res.render('index', {
                title: 'Архив',
                data : data,
                user : req.user
            });
        });
    }
});

router.get('/new', function (req, res) {
    res.render('new', {
        title: 'Новый пост'
    });
});

router.post('/new', function (req, res) {
    (new Post({
        title:  req.body.title,
        body :  req.body.body,
        user_id: req.user._id
    })).save(function (err) {
        if (err) res.send(err);
        res.redirect('/');
    });
});

router.get('/post-:id', function (req, res) {
    Post.findById(req.params.id, function (err, data) {
        Comment.find({'post_id': req.params.id}, function (err, comments) {
            if (err) console.log(err);

            res.render('show', {
                title   : 'Просмотр',
                data    : data,
                comments: comments
            })
        });
    })
});

router.post('/post-:id', function (req, res) {
    new Comment({
        user_id : req.user._id,
        post_id : req.params.id,
        text    : req.body.text
    }).save(function (err) {
        if (err) res.send(err);
        var url = '/post-' + req.params.id;
        res.redirect(url);
    });
});

router.get('/post-:id/edit', function (req, res) {
    Post.findById(req.params.id, function (err, data) {
        if (err) console.log(err);

        res.render('edit', {
            title: 'Просмотр',
            data : data
        })
    })
});

router.post('/post-:id', function (req, res) {
    Post.update({ '_id': req.params.id }, {
        title: req.body.title,
        body : req.body.body
    }, function (err) {
        if (err) res.send(err);

        res.redirect('/');
    });
});

module.exports = router;
