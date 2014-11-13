var express  = require('express'),
    mongoose = require('mongoose');

var router  = express.Router();

var Post    = require('../models/post');

/* GET home page. */
router.get('/', function (req, res) {
    Post.find().exec(function (err, data) {
        res.render('index', {
            title: 'Архив',
            data : data,
            user : 'me'//req.user.name
        });
    })
});

router.get('/new', function (req, res) {
    res.render('new', {
        title: 'New post'
    });
});

router.post('/new', function (req, res) {
        new Post({
            title:  req.body.title,
            body :  req.body.body
        }).save(function(err) {
                if (err) res.send(err);
                res.redirect('/');
            });
});

router.get('/:id/', function (req, res) {
    Post.findById(req.params.id, function (err, data) {
        if (err) console.log(err);

        res.render('show', {
            title: 'Просмотр',
            data : data
        })
    })
});

router.post('/:id', function (req, res) {
    Post.update({ '_id': req.params.id }, {
        title: req.body.title,
        body : req.body.body
    }, function (err) {
        if (err) res.send(err);

        res.redirect('/');
    })
});

module.exports = router;
