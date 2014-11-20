var mongoose        = require('mongoose');
mongoose.connect('mongodb://localhost/node-blog');
var User = require('./models/user');
(new User({
    username: 'Joseph Dredd',
    email: 'law@mega-city1.com',
    password: 'iamthelaw',
    admin: true
})).save(function (err) {
    console.log(err);
});