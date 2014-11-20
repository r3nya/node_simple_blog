var mongoose    = require('mongoose');
var crypto      = require('crypto');
var Schema      = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');
var validator = require('validator');

var UserSchema = new Schema({
    username:   { type: String, required: true, index: { unique: true } },
    password:   { type: String, required: true },
    email:      { type: String, required: true, index: { unique: true } },
    created_at: { type: Date,    default: Date.now },
    admin:      { type: Boolean,    default: false },
    vkontakteId: { type: String, index: true }
});

UserSchema.plugin(findOrCreate);

function encodeString(string, enc) {
    return crypto.createHash(enc).update(string).digest('hex').toLowerCase();
}

UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = encodeString(this.password, 'sha1');
    }

    next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    return this.password === encodeString(candidatePassword, 'sha1');
};

var User = mongoose.model('User', UserSchema);

User.schema.path('email').validate(function (value) {
    return validator.isEmail(value);
}, 'Неправильный email');

module.exports = User;